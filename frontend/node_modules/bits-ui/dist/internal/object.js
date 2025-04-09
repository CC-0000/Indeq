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
