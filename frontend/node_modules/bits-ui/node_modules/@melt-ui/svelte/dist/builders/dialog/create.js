import { createFocusTrap, useEscapeKeydown, usePortal } from '../../internal/actions/index.js';
import { addMeltEventListener, makeElement, createElHelpers, effect, executeCallbacks, generateIds, getPortalDestination, handleFocus, isBrowser, isHTMLElement, kbd, noop, omit, overridable, removeScroll, styleToString, toWritableStores, portalAttr, } from '../../internal/helpers/index.js';
import { withGet } from '../../internal/helpers/withGet.js';
import { tick } from 'svelte';
import { derived, writable } from 'svelte/store';
import { useModal } from '../../internal/actions/modal/action.js';
const { name } = createElHelpers('dialog');
const defaults = {
    preventScroll: true,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    role: 'dialog',
    defaultOpen: false,
    portal: undefined,
    forceVisible: false,
    openFocus: undefined,
    closeFocus: undefined,
    onOutsideClick: undefined,
};
export const dialogIdParts = ['content', 'title', 'description'];
export function createDialog(props) {
    const withDefaults = { ...defaults, ...props };
    const options = toWritableStores(omit(withDefaults, 'ids'));
    const { preventScroll, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible, openFocus, closeFocus, onOutsideClick, } = options;
    const activeTrigger = withGet.writable(null);
    const ids = toWritableStores({
        ...generateIds(dialogIdParts),
        ...withDefaults.ids,
    });
    const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
    const open = overridable(openWritable, withDefaults?.onOpenChange);
    const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
        return $open || $forceVisible;
    });
    let unsubScroll = noop;
    function handleOpen(e) {
        const el = e.currentTarget;
        const triggerEl = e.currentTarget;
        if (!isHTMLElement(el) || !isHTMLElement(triggerEl))
            return;
        open.set(true);
        activeTrigger.set(triggerEl);
    }
    function handleClose() {
        open.set(false);
        handleFocus({
            prop: closeFocus.get(),
            defaultEl: activeTrigger.get(),
        });
    }
    const trigger = makeElement(name('trigger'), {
        stores: [open],
        returned: ([$open]) => {
            return {
                'aria-haspopup': 'dialog',
                'aria-expanded': $open,
                type: 'button',
            };
        },
        action: (node) => {
            const unsub = executeCallbacks(addMeltEventListener(node, 'click', (e) => {
                handleOpen(e);
            }), addMeltEventListener(node, 'keydown', (e) => {
                if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
                    return;
                e.preventDefault();
                handleOpen(e);
            }));
            return {
                destroy: unsub,
            };
        },
    });
    const overlay = makeElement(name('overlay'), {
        stores: [isVisible, open],
        returned: ([$isVisible, $open]) => {
            return {
                hidden: $isVisible ? undefined : true,
                tabindex: -1,
                style: styleToString({
                    display: $isVisible ? undefined : 'none',
                }),
                'aria-hidden': true,
                'data-state': $open ? 'open' : 'closed',
            };
        },
        action: (node) => {
            let unsubEscapeKeydown = noop;
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
            return {
                destroy() {
                    unsubEscapeKeydown();
                },
            };
        },
    });
    const content = makeElement(name('content'), {
        stores: [isVisible, ids.content, ids.description, ids.title, open],
        returned: ([$isVisible, $contentId, $descriptionId, $titleId, $open]) => {
            return {
                id: $contentId,
                role: role.get(),
                'aria-describedby': $descriptionId,
                'aria-labelledby': $titleId,
                'aria-modal': $isVisible ? 'true' : undefined,
                'data-state': $open ? 'open' : 'closed',
                tabindex: -1,
                hidden: $isVisible ? undefined : true,
                style: styleToString({
                    display: $isVisible ? undefined : 'none',
                }),
            };
        },
        action: (node) => {
            let activate = noop;
            let deactivate = noop;
            const destroy = executeCallbacks(effect([open, closeOnOutsideClick, closeOnEscape], ([$open, $closeOnOutsideClick, $closeOnEscape]) => {
                if (!$open)
                    return;
                const focusTrap = createFocusTrap({
                    immediate: false,
                    escapeDeactivates: $closeOnEscape,
                    clickOutsideDeactivates: $closeOnOutsideClick,
                    allowOutsideClick: true,
                    returnFocusOnDeactivate: false,
                    fallbackFocus: node,
                });
                activate = focusTrap.activate;
                deactivate = focusTrap.deactivate;
                const ac = focusTrap.useFocusTrap(node);
                if (ac && ac.destroy) {
                    return ac.destroy;
                }
                else {
                    return focusTrap.deactivate;
                }
            }), effect([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
                return useModal(node, {
                    open: $open,
                    closeOnInteractOutside: $closeOnOutsideClick,
                    onClose() {
                        handleClose();
                    },
                    shouldCloseOnInteractOutside(e) {
                        onOutsideClick.get()?.(e);
                        if (e.defaultPrevented)
                            return false;
                        return true;
                    },
                }).destroy;
            }), effect([closeOnEscape], ([$closeOnEscape]) => {
                if (!$closeOnEscape)
                    return noop;
                return useEscapeKeydown(node, { handler: handleClose }).destroy;
            }), effect([isVisible], ([$isVisible]) => {
                tick().then(() => {
                    if (!$isVisible) {
                        deactivate();
                    }
                    else {
                        activate();
                    }
                });
            }));
            return {
                destroy: () => {
                    unsubScroll();
                    destroy();
                },
            };
        },
    });
    const portalled = makeElement(name('portalled'), {
        stores: portal,
        returned: ($portal) => ({
            'data-portal': portalAttr($portal),
        }),
        action: (node) => {
            const unsubPortal = effect([portal], ([$portal]) => {
                if ($portal === null)
                    return noop;
                const portalDestination = getPortalDestination(node, $portal);
                if (portalDestination === null)
                    return noop;
                return usePortal(node, portalDestination).destroy;
            });
            return {
                destroy() {
                    unsubPortal();
                },
            };
        },
    });
    const title = makeElement(name('title'), {
        stores: [ids.title],
        returned: ([$titleId]) => ({
            id: $titleId,
        }),
    });
    const description = makeElement(name('description'), {
        stores: [ids.description],
        returned: ([$descriptionId]) => ({
            id: $descriptionId,
        }),
    });
    const close = makeElement(name('close'), {
        returned: () => ({
            type: 'button',
        }),
        action: (node) => {
            const unsub = executeCallbacks(addMeltEventListener(node, 'click', () => {
                handleClose();
            }), addMeltEventListener(node, 'keydown', (e) => {
                if (e.key !== kbd.SPACE && e.key !== kbd.ENTER)
                    return;
                e.preventDefault();
                handleClose();
            }));
            return {
                destroy: unsub,
            };
        },
    });
    effect([open, preventScroll], ([$open, $preventScroll]) => {
        if (!isBrowser)
            return;
        if ($preventScroll && $open)
            unsubScroll = removeScroll();
        if ($open) {
            const contentEl = document.getElementById(ids.content.get());
            handleFocus({ prop: openFocus.get(), defaultEl: contentEl });
        }
        return () => {
            // we only want to remove the scroll lock if the dialog is not forced visible
            // otherwise the scroll removal is handled in the `destroy` of the `content` builder
            if (!forceVisible.get()) {
                unsubScroll();
            }
        };
    });
    return {
        ids,
        elements: {
            content,
            trigger,
            title,
            description,
            overlay,
            close,
            portalled,
        },
        states: {
            open,
        },
        options,
    };
}
