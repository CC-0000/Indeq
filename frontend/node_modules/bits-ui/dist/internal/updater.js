export function getOptionUpdater(options) {
    return function (key, value) {
        if (value === undefined)
            return;
        const store = options[key];
        if (store) {
            store.set(value);
        }
    };
}
