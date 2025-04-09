import { dequal } from 'dequal';
export function omit(obj, ...keys) {
    const result = {};
    for (const key of Object.keys(obj)) {
        if (!keys.includes(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}
export function stripValues(inputObject, toStrip, recursive) {
    return Object.fromEntries(Object.entries(inputObject).filter(([_, value]) => !dequal(value, toStrip)));
}
export function removeUndefined(obj) {
    const result = {};
    for (const key in obj) {
        const value = obj[key];
        if (value !== undefined) {
            result[key] = value;
        }
    }
    return result;
}
