// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { effect } from './internal/helpers/index.js';
import { dequal } from 'dequal';
/**
 * Typed Object.keys
 *
 * @export
 * @template {Record<string, unknown>} T
 * @param {T} obj
 * @returns {(keyof T)[]}
 */
function keys(obj) {
    return Object.keys(obj);
}
export function createSync(stores) {
    let setters = {};
    keys(stores).forEach((key) => {
        const store = stores[key];
        effect(store, (value) => {
            if (key in setters) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setters[key]?.(value);
            }
        });
    });
    return keys(stores).reduce((acc, key) => {
        return {
            ...acc,
            [key]: function sync(value, setter) {
                stores[key].update((p) => {
                    if (dequal(p, value))
                        return p;
                    return value;
                });
                if (setter) {
                    setters = { ...setters, [key]: setter };
                }
            },
        };
    }, {});
}
