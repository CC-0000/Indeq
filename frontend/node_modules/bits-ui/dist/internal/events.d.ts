type MeltEvent<T extends Event = Event> = {
    detail: {
        originalEvent: T;
    };
    cancelable: boolean;
    preventDefault: () => void;
};
export type SvelteEvent<T extends Event = Event, U extends EventTarget = EventTarget> = T & {
    currentTarget: EventTarget & U;
};
export declare function createDispatcher<M extends Element = Element>(): (e: MeltEvent) => void;
export type CreateDispatcher = {
    createDispatcher: typeof createDispatcher;
};
export {};
