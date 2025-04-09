import { addMeltEventListener, makeElement, createElHelpers, derivedVisible, effect, executeCallbacks, getPortalDestination, handleFocus, isBrowser, isElement, isHTMLElement, kbd, noop, omit, overridable, removeScroll, styleToString, toWritableStores, portalAttr, generateIds, withGet, } from '../../internal/helpers/index.js';
import { useEscapeKeydown, usePopper, usePortal, } from '../../internal/actions/index.js';
import { safeOnMount } from '../../internal/helpers/lifecycle.js';
import { tick } from 'svelte';
import { writable } from 'svelte/store';
const defaults = {
    positioning: {
        placement: 'bottom',
    },
    arrowSize: 8,
    defaultOpen: false,
    disableFocusTrap: false,
    closeOnEscape: true,
    preventScroll: false,
    onOpenChange: undefined,
    closeOnOutsideClick: true,
    portal: undefined,
    forceVisible: false,
    openFocus: undefined,
    closeFocus: undefined,
    onOutsideClick: undefined,
};
const { name } = createElHelpers('popover');
export const popoverIdParts = ['trigger', 'content'];
export function createPopover(args) {
    const withDefaults = { ...defaults, ...args };
    const options = toWritableStores(omit(withDefaults, 'open', 'ids'));
    const { positioning, arrowSize, disableFocusTrap, preventScroll, closeOnEscape, closeOnOutsideClick, portal, forceVisible, openFocus, closeFocus, onOutsideClick, } = options;
    const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
    const open = overridable(openWritable, withDefaults?.onOpenChange);
    const activeTrigger = withGet.writable(null);
    const ids = toWritableStores({ ...generateIds(popoverIdParts), ...withDefaults.ids });
    safeOnMount(() => {
        activeTrigger.set(document.getElementById(ids.trigger.get()));
    });
    function handleClose() {
        open.set(false);
        const triggerEl = document.getElementById(ids.trigger.get());
        handleFocus({ prop: closeFocus.get(), defaultEl: triggerEl });
    }
    const isVisible = derivedVisible({ open, activeTrigger, forceVisible });
    const content = makeElement(name('content'), {
        stores: [isVisible, portal, ids.content],
        returned: ([$isVisible, $portal, $contentId]) => {
            return {
                hidden: $isVisible && isBrowser ? undefined : true,
                tabindex: -1,
                style: styleToString({
                    display: $isVisible ? undefined : 'none',
                }),
                id: $contentId,
                'data-state': $isVisible ? 'open' : 'closed',
                'data-portal': portalAttr($portal),
            };
        },
        action: (node) => {
            let unsubPopper = noop;
            const unsubDerived = effect([
                isVisible,
                activeTrigger,
                positioning,
                disableFocusTrap,
                closeOnEscape,
                closeOnOutsideClick,
                portal,
            ], ([$isVisible, $activeTrigger, $positioning, $disableFocusTrap, $closeOnEscape, $closeOnOutsideClick, $portal,]) => {
                unsubPopper();
                if (!$isVisible || !$activeTrigger)
                    return;
                tick().then(() => {
                    unsubPopper();
                    unsubPopper = usePopper(node, {
                        anchorElement: $activeTrigger,
                        open,
                        options: {
                            floating: $positioning,
                            focusTrap: $disableFocusTrap
                                ? null
                                : {
                                    returnFocusOnDeactivate: false,
                                    clickOutsideDeactivates: $closeOnOutsideClick,
                                    allowOutsideClick: true,
                                    escapeDeactivates: $closeOnEscape,
                                },
                            modal: {
                                shouldCloseOnInteractOutside: shouldCloseOnInteractOutside,
                                onClose: handleClose,
                                open: $isVisible,
                                closeOnInteractOutside: $closeOnOutsideClick,
                            },
                            escapeKeydown: $closeOnEscape
                                ? {
                                    handler: () => {
                                        handleClose();
                                    },
                                }
                                : null,
                            portal: getPortalDestination(node, $portal),
                        },
                    }).destroy;
                });
            });
            return {
                destroy() {
                    unsubDerived();
                    unsubPopper();
                },
            };
        },
    });
    function toggleOpen(triggerEl) {
        open.update((prev) => {
            return !prev;
        });
        if (triggerEl && triggerEl !== activeTrigger.get()) {
            activeTrigger.set(triggerEl);
        }
    }
    function shouldCloseOnInteractOutside(e) {
        onOutsideClick.get()?.(e);
        if (e.defaultPrevented)
            return false;
        const target = e.target;
        const triggerEl = document.getElementById(ids.trigger.get());
        if (triggerEl && isElement(target)) {
            if (target === triggerEl || triggerEl.contains(target))
                return false;
        }
        return true;
    }
    const trigger = makeElement(name('trigger'), {
        stores: [isVisible, ids.content, ids.trigger],
        returned: ([$isVisible, $contentId, $triggerId]) => {
            return {
                role: 'button',
                'aria-haspopup': 'dialog',
                'aria-expanded': $isVisible ? 'true' : 'false',
                'data-state': stateAttr($isVisible),
                'aria-controls': $contentId,
                id: $triggerId,
            };
        },
        action: (node) => {
            const unsub = executeCallbacks(addMeltEventListener(node, 'click', () => {
                toggleOpen(node);
            }), addMeltEventListener(node, 'keydown', (e) => {
                if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
                    return;
                e.preventDefault();
                toggleOpen(node);
            }));
            return {
                destroy: unsub,
            };
        },
    });
    const overlay = makeElement(name('overlay'), {
        stores: [isVisible],
        returned: ([$isVisible]) => {
            return {
                hidden: $isVisible ? undefined : true,
                tabindex: -1,
                style: styleToString({
                    display: $isVisible ? undefined : 'none',
                }),
                'aria-hidden': 'true',
                'data-state': stateAttr($isVisible),
            };
        },
        action: (node) => {
            let unsubEscapeKeydown = noop;
            let unsubDerived = noop;
            let unsubPortal = noop;
            if (closeOnEscape.get()) {
                const escapeKeydown = useEscapeKeydown(node, {
                    handler: () => {
                        handleClose();
                    },
                });
                if (escapeKeydown && escapeKeydown.destroy) {
                    unsubEscapeKeydown = escapeKeydown.destroy;
                }
            }
            unsubDerived = effect([portal], ([$portal]) => {
                unsubPortal();
                if ($portal === null)
                    return;
                const portalDestination = getPortalDestination(node, $portal);
                if (portalDestination === null)
                    return;
                unsubPortal = usePortal(node, portalDestination).destroy;
            });
            return {
                destroy() {
                    unsubEscapeKeydown();
                    unsubDerived();
                    unsubPortal();
                },
            };
        },
    });
    const arrow = makeElement(name('arrow'), {
        stores: arrowSize,
        returned: ($arrowSize) => ({
            'data-arrow': true,
            style: styleToString({
                position: 'absolute',
                width: `var(--arrow-size, ${$arrowSize}px)`,
                height: `var(--arrow-size, ${$arrowSize}px)`,
            }),
        }),
    });
    const close = makeElement(name('close'), {
        returned: () => ({
            type: 'button',
        }),
        action: (node) => {
            const unsub = executeCallbacks(addMeltEventListener(node, 'click', (e) => {
                if (e.defaultPrevented)
                    return;
                handleClose();
            }), addMeltEventListener(node, 'keydown', (e) => {
                if (e.defaultPrevented)
                    return;
                if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
                    return;
                e.preventDefault();
                toggleOpen();
            }));
            return {
                destroy: unsub,
            };
        },
    });
    effect([open, activeTrigger, preventScroll], ([$open, $activeTrigger, $preventScroll]) => {
        if (!isBrowser)
            return;
        const unsubs = [];
        if ($open) {
            if (!$activeTrigger) {
                tick().then(() => {
                    const triggerEl = document.getElementById(ids.trigger.get());
                    if (!isHTMLElement(triggerEl))
                        return;
                    activeTrigger.set(triggerEl);
                });
            }
            if ($preventScroll) {
                unsubs.push(removeScroll());
            }
            const triggerEl = $activeTrigger ?? document.getElementById(ids.trigger.get());
            handleFocus({ prop: openFocus.get(), defaultEl: triggerEl });
        }
        return () => {
            unsubs.forEach((unsub) => unsub());
        };
    });
    return {
        ids,
        elements: {
            trigger,
            content,
            arrow,
            close,
            overlay,
        },
        states: {
            open,
        },
        options,
    };
}
function stateAttr(open) {
    return open ? 'open' : 'closed';
}
