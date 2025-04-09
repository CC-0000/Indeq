/// <reference types="svelte" />
export interface Machine<S> {
    [k: string]: {
        [k: string]: S;
    };
}
export type MachineState<T> = keyof T;
export type MachineEvent<T> = {
    [K in keyof T]: keyof T[K];
}[keyof T];
/**
 * Creates a state machine with the given initial state and machine definition.
 * @param initialState - The initial state of the machine.
 * @param machine - The definition of the state machine, mapping states to possible transitions.
 * @returns An object containing the state store and a dispatch function for state transitions.
 */
export declare function createStateMachine<M>(initialState: MachineState<M>, machine: M & Machine<MachineState<M>>): {
    state: import("../withGet.js").WithGet<import("svelte/store").Writable<keyof M>>;
    dispatch: (event: MachineEvent<M>) => void;
};
