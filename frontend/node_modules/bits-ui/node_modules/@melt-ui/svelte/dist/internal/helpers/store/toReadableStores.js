import { readable } from 'svelte/store';
import { isReadable } from '../is.js';
import { withGet } from '../withGet.js';
/**
 * Given an object of properties, returns an object of writable stores
 * with the same properties and values.
 */
export function toReadableStores(properties) {
    const result = {};
    Object.keys(properties).forEach((key) => {
        const propertyKey = key;
        const value = properties[propertyKey];
        if (isReadable(value)) {
            result[propertyKey] = withGet(value);
        }
        else {
            result[propertyKey] = withGet(readable(value));
        }
    });
    return result;
}
