import { get, writable } from 'svelte/store';
/**
 * Transforms an existing store into a store with a `get` method.
 * Uses subscriptions to keep the value up to date, so make sure to call `destroy` when you're done with it.
 * @date 20/01/2024 - 16:38:39
 *
 * @export
 * @template {Readable<unknown>} T
 * @param {T} store
 * @returns {WithGet<T>}
 */
export function withGet(store) {
    return {
        ...store,
        get: () => get(store),
    };
}
withGet.writable = function (initial) {
    const internal = writable(initial);
    let value = initial;
    return {
        subscribe: internal.subscribe,
        set(newValue) {
            internal.set(newValue);
            value = newValue;
        },
        update(updater) {
            const newValue = updater(value);
            internal.set(newValue);
            value = newValue;
        },
        get() {
            return value;
        },
    };
};
withGet.derived = function (stores, fn) {
    const subscribers = new Map();
    const get = () => {
        const values = Array.isArray(stores) ? stores.map((store) => store.get()) : stores.get();
        return fn(values);
    };
    const subscribe = (subscriber) => {
        const unsubscribers = [];
        const storesArr = Array.isArray(stores) ? stores : [stores];
        storesArr.forEach((store) => {
            unsubscribers.push(store.subscribe(() => {
                subscriber(get());
            }));
        });
        subscriber(get());
        subscribers.set(subscriber, unsubscribers);
        return () => {
            const unsubscribers = subscribers.get(subscriber);
            if (unsubscribers) {
                for (const unsubscribe of unsubscribers) {
                    unsubscribe();
                }
            }
            subscribers.delete(subscriber);
        };
    };
    return {
        get,
        subscribe,
    };
};
export function addGetToStores(stores) {
    return Object.keys(stores).reduce((acc, key) => {
        return {
            ...acc,
            [key]: withGet(stores[key]),
        };
    }, {});
}
