import { addEventListener, isElement, executeCallbacks, noop, } from '../../helpers/index.js';
export const useInteractOutside = ((node, config) => {
    let unsub = noop;
    let unsubClick = noop;
    let isPointerDown = false;
    let isPointerDownInside = false;
    let ignoreEmulatedMouseEvents = false;
    function update(config) {
        unsub();
        unsubClick();
        const { onInteractOutside, onInteractOutsideStart, enabled } = config;
        if (!enabled)
            return;
        function onPointerDown(e) {
            if (onInteractOutside && isValidEvent(e, node)) {
                onInteractOutsideStart?.(e);
            }
            const target = e.target;
            if (isElement(target) && isOrContainsTarget(node, target)) {
                isPointerDownInside = true;
            }
            isPointerDown = true;
        }
        function triggerInteractOutside(e) {
            onInteractOutside?.(e);
        }
        const documentObj = getOwnerDocument(node);
        // Use pointer events if available, otherwise use mouse/touch events
        if (typeof PointerEvent !== 'undefined') {
            const onPointerUp = (e) => {
                unsubClick();
                const handler = (e) => {
                    if (shouldTriggerInteractOutside(e)) {
                        triggerInteractOutside(e);
                    }
                    resetPointerState();
                };
                /**
                 * On touch devices, we need to wait for a click event because browsers implement
                 * a delay between the time the user stops touching the display and when the
                 * browser executes the click event. Without waiting for the click event, the
                 * browser may execute events on other elements that should have been prevented.
                 */
                if (e.pointerType === 'touch') {
                    unsubClick = addEventListener(documentObj, 'click', handler, {
                        capture: true,
                        once: true,
                    });
                    return;
                }
                handler(e);
            };
            unsub = executeCallbacks(addEventListener(documentObj, 'pointerdown', onPointerDown, true), addEventListener(documentObj, 'pointerup', onPointerUp, true));
        }
        else {
            const onMouseUp = (e) => {
                if (ignoreEmulatedMouseEvents) {
                    ignoreEmulatedMouseEvents = false;
                }
                else if (shouldTriggerInteractOutside(e)) {
                    triggerInteractOutside(e);
                }
                resetPointerState();
            };
            const onTouchEnd = (e) => {
                ignoreEmulatedMouseEvents = true;
                if (shouldTriggerInteractOutside(e)) {
                    triggerInteractOutside(e);
                }
                resetPointerState();
            };
            unsub = executeCallbacks(addEventListener(documentObj, 'mousedown', onPointerDown, true), addEventListener(documentObj, 'mouseup', onMouseUp, true), addEventListener(documentObj, 'touchstart', onPointerDown, true), addEventListener(documentObj, 'touchend', onTouchEnd, true));
        }
    }
    function shouldTriggerInteractOutside(e) {
        if (isPointerDown && !isPointerDownInside && isValidEvent(e, node)) {
            return true;
        }
        return false;
    }
    function resetPointerState() {
        isPointerDown = false;
        isPointerDownInside = false;
    }
    update(config);
    return {
        update,
        destroy() {
            unsub();
            unsubClick();
        },
    };
});
function isValidEvent(e, node) {
    if ('button' in e && e.button > 0)
        return false;
    const target = e.target;
    if (!isElement(target))
        return false;
    // if the target is no longer in the document (e.g. it was removed) ignore it
    const ownerDocument = target.ownerDocument;
    if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
        return false;
    }
    return node && !isOrContainsTarget(node, target);
}
function isOrContainsTarget(node, target) {
    return node === target || node.contains(target);
}
function getOwnerDocument(el) {
    return el?.ownerDocument ?? document;
}
