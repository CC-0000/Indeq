import { writable } from 'svelte/store';
import { withGet } from '../withGet.js';
/**
 * Given an object of properties, returns an object of writable stores
 * with the same properties and values.
 */
export function toWritableStores(properties) {
    const result = {};
    Object.keys(properties).forEach((key) => {
        const propertyKey = key;
        const value = properties[propertyKey];
        result[propertyKey] = withGet(writable(value));
    });
    return result;
}
