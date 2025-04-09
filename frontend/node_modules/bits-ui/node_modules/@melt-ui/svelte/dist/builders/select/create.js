import { derived } from 'svelte/store';
import { createListbox } from '../listbox/create.js';
export function createSelect(props) {
    const listbox = createListbox({ ...props, builder: 'select' });
    const selectedLabel = derived(listbox.states.selected, ($selected) => {
        if (Array.isArray($selected)) {
            return $selected.map((o) => o.label).join(', ');
        }
        return $selected?.label ?? '';
    });
    return {
        ...listbox,
        elements: {
            ...listbox.elements,
        },
        states: {
            ...listbox.states,
            selectedLabel,
        },
    };
}
