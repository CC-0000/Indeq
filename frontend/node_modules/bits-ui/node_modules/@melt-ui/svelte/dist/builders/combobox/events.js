import { listboxEvents } from '../listbox/events.js';
export const comboboxEvents = {
    ...listboxEvents,
    input: ['click', 'keydown', 'input'],
};
