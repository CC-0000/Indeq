/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import { type Readable } from 'svelte/store';
import type { ListboxEvents } from './events.js';
import type { CreateListboxProps, ListboxOption, ListboxOptionProps, ListboxSelected } from './types.js';
export declare const INTERACTION_KEYS: string[];
export declare const listboxIdParts: readonly ["trigger", "menu", "label"];
export type ListboxIdParts = typeof listboxIdParts;
/**
 * Creates an ARIA-1.2-compliant listbox.
 *
 * @TODO multi-select using `tags-input` builder?
 */
export declare function createListbox<Value, Multiple extends boolean = false, S extends ListboxSelected<Multiple, Value> = ListboxSelected<Multiple, Value>>(props?: CreateListboxProps<Value, Multiple, S>): {
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        label: string;
        menu: string;
        trigger: string;
    }>;
    elements: {
        trigger: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<HTMLElement | null>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<ListboxEvents['trigger']>, ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]: [boolean, HTMLElement | null, boolean, string, string, string]) => {
            readonly 'aria-activedescendant': string | undefined;
            readonly 'aria-autocomplete': "list";
            readonly 'aria-controls': string;
            readonly 'aria-expanded': boolean;
            readonly 'aria-labelledby': string;
            readonly id: string;
            readonly role: "combobox";
            readonly disabled: true | undefined;
            readonly type: "button" | undefined;
        }, string>;
        group: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            role: string;
            'aria-labelledby': string;
        }, string>;
        option: import("../../internal/helpers/index.js").MeltElement<[Readable<(value: Value) => boolean>], (node: HTMLElement) => MeltActionReturn<ListboxEvents['item']>, ([$isSelected]: [(value: Value) => boolean]) => (props: ListboxOptionProps<Value>) => {
            readonly 'data-value': string;
            readonly 'data-label': string | undefined;
            readonly 'data-disabled': true | undefined;
            readonly 'aria-disabled': true | undefined;
            readonly 'aria-selected': boolean;
            readonly 'data-selected': "" | undefined;
            readonly id: string;
            readonly role: "option";
        }, string>;
        menu: import("../../internal/helpers/index.js").MeltElement<[Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<ListboxEvents['menu']>, ([$isVisible, $menuId]: [boolean, string]) => {
            readonly hidden: true | undefined;
            readonly id: string;
            readonly role: "listbox";
            readonly style: string;
        }, string>;
        groupLabel: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            id: string;
        }, string>;
        label: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<"mousedown">, ([$labelId, $triggerId]: [string, string]) => {
            id: string;
            for: string;
        }, string>;
        hiddenInput: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("../../internal/helpers/index.js").WithGet<Readable<boolean>>, import("../../internal/helpers/index.js").WithGet<Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            'aria-hidden': "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            style: string;
        }, string>;
        arrow: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<number | undefined>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number | undefined) => {
            'data-arrow': boolean;
            style: string;
        }, string>;
    };
    states: {
        open: {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        };
        selected: {
            update: (updater: import("svelte/store").Updater<S | undefined>, sideEffect?: ((newValue: S | undefined) => void) | undefined) => void;
            set: (this: void, value: S | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<S | undefined>, invalidate?: import("svelte/store").Invalidator<S | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => S | undefined;
            destroy?: (() => void) | undefined;
        };
        highlighted: Readable<ListboxOption<Value> | undefined>;
        highlightedItem: import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<HTMLElement | null>>;
    };
    helpers: {
        isSelected: Readable<(value: Value) => boolean>;
        isHighlighted: Readable<(item: Value) => boolean>;
        closeMenu: () => void;
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<{
        multiple: Multiple;
        disabled: boolean;
        forceVisible: boolean;
        name: string | undefined;
        preventScroll: boolean;
        portal: string | HTMLElement | null | undefined;
        required: boolean;
        onOpenChange?: import("../../internal/helpers/index.js").ChangeFn<boolean> | undefined;
        positioning: import("../../internal/actions/index.js").FloatingConfig | {
            placement: "bottom";
            sameWidth: true;
        };
        arrowSize?: number | undefined;
        scrollAlignment: "center" | "nearest";
        loop: boolean;
        defaultSelected?: S | undefined;
        selected?: import("svelte/store").Writable<S> | undefined;
        onSelectedChange?: import("../../internal/helpers/index.js").ChangeFn<S | undefined> | undefined;
        closeOnOutsideClick: boolean;
        closeOnEscape: boolean;
        onOutsideClick: ((event: import("../../internal/actions/index.js").InteractOutsideEvent) => void) | undefined;
        typeahead: boolean;
        highlightOnHover: boolean;
    }>;
};
