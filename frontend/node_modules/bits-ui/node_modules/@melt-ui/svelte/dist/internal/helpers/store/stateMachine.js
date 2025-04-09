import { withGet } from '../withGet.js';
/**
 * Creates a state machine with the given initial state and machine definition.
 * @param initialState - The initial state of the machine.
 * @param machine - The definition of the state machine, mapping states to possible transitions.
 * @returns An object containing the state store and a dispatch function for state transitions.
 */
export function createStateMachine(initialState, machine) {
    // init a store with the initial state
    const state = withGet.writable(initialState);
    function reducer(event) {
        const $state = state.get();
        // Get next state based on the current state & event,
        // or keep current state if no transition is defined.
        const nextState = machine[$state][event];
        return nextState ?? $state;
    }
    const dispatch = (event) => {
        state.set(reducer(event));
    };
    return {
        state,
        dispatch,
    };
}
