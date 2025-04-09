import { styleToString } from './style.js';
export function disabledAttr(disabled) {
    return disabled ? true : undefined;
}
export const hiddenInputAttrs = {
    type: 'hidden',
    'aria-hidden': true,
    hidden: true,
    tabIndex: -1,
    style: styleToString({
        position: 'absolute',
        opacity: 0,
        'pointer-events': 'none',
        margin: 0,
        transform: 'translateX(-100%)',
    }),
};
/**
 * @param portal The value of the `portal` option store.
 * @returns the value of the `data-portal` attribute.
 */
export function portalAttr(portal) {
    if (portal !== null) {
        return '';
    }
    return undefined;
}
