import { overridable, toWritableStores } from '../../internal/helpers/index.js';
import { withGet } from '../../internal/helpers/withGet.js';
import { writable } from 'svelte/store';
import { omit } from '../../internal/helpers/object.js';
import { createMenuBuilder } from '../menu/index.js';
const defaults = {
    arrowSize: 8,
    positioning: {
        placement: 'bottom',
    },
    preventScroll: true,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    portal: undefined,
    loop: false,
    dir: 'ltr',
    defaultOpen: false,
    forceVisible: false,
    typeahead: true,
    closeFocus: undefined,
    disableFocusFirstItem: false,
    closeOnItemClick: true,
    onOutsideClick: undefined,
};
export function createDropdownMenu(props) {
    const withDefaults = { ...defaults, ...props };
    const rootOptions = toWritableStores(omit(withDefaults, 'ids'));
    const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
    const rootOpen = overridable(openWritable, withDefaults?.onOpenChange);
    const rootActiveTrigger = withGet(writable(null));
    const nextFocusable = withGet(writable(null));
    const prevFocusable = withGet(writable(null));
    const { elements, builders, ids, states, options } = createMenuBuilder({
        rootOptions,
        rootOpen,
        rootActiveTrigger: withGet(rootActiveTrigger),
        nextFocusable: withGet(nextFocusable),
        prevFocusable: withGet(prevFocusable),
        selector: 'dropdown-menu',
        removeScroll: true,
        ids: withDefaults.ids,
    });
    return {
        ids,
        elements,
        states,
        builders,
        options,
    };
}
