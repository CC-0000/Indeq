import { withGet } from './withGet.js';
export const overridable = (_store, onChange) => {
    const store = withGet(_store);
    const update = (updater, sideEffect) => {
        store.update((curr) => {
            const next = updater(curr);
            let res = next;
            if (onChange) {
                res = onChange({ curr, next });
            }
            sideEffect?.(res);
            return res;
        });
    };
    const set = (curr) => {
        update(() => curr);
    };
    return {
        ...store,
        update,
        set,
    };
};
