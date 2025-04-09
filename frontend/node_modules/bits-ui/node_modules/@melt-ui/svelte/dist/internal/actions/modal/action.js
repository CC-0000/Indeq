import { isElement, last, noop, sleep } from '../../helpers/index.js';
import { useInteractOutside } from '../index.js';
const visibleModals = [];
export const useModal = ((node, config) => {
    let unsubInteractOutside = noop;
    function removeNodeFromVisibleModals() {
        const index = visibleModals.indexOf(node);
        if (index >= 0) {
            visibleModals.splice(index, 1);
        }
    }
    function update(config) {
        unsubInteractOutside();
        const { open, onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config;
        sleep(100).then(() => {
            if (open) {
                visibleModals.push(node);
            }
            else {
                removeNodeFromVisibleModals();
            }
        });
        function isLastModal() {
            return last(visibleModals) === node;
        }
        function closeModal() {
            // we only want to call onClose if this is the topmost modal
            if (isLastModal() && onClose) {
                onClose();
                removeNodeFromVisibleModals();
            }
        }
        function onInteractOutsideStart(e) {
            const target = e.target;
            if (!isElement(target))
                return;
            if (target && isLastModal()) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
        function onInteractOutside(e) {
            if (shouldCloseOnInteractOutside?.(e) && isLastModal()) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                closeModal();
            }
        }
        unsubInteractOutside = useInteractOutside(node, {
            onInteractOutsideStart,
            onInteractOutside: closeOnInteractOutside ? onInteractOutside : undefined,
            enabled: open,
        }).destroy;
    }
    update(config);
    return {
        update,
        destroy() {
            removeNodeFromVisibleModals();
            unsubInteractOutside();
        },
    };
});
