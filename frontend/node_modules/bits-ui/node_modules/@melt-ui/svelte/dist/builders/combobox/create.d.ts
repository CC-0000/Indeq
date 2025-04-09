/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import type { ComboboxEvents } from './events.js';
import type { ComboboxSelected, CreateComboboxProps } from './types.js';
export declare const INTERACTION_KEYS: string[];
/**
 * Creates an ARIA-1.2-compliant combobox.
 *
 * @TODO multi-select using `tags-input` builder?
 */
export declare function createCombobox<Value, Multiple extends boolean = false, S extends ComboboxSelected<Multiple, Value> = ComboboxSelected<Multiple, Value>>(props?: CreateComboboxProps<Value, Multiple, S>): {
    elements: {
        input: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<HTMLElement | null>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<"input" | "click" | "keydown">, ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]: [boolean, HTMLElement | null, boolean, string, string, string]) => {
            readonly 'aria-activedescendant': string | undefined;
            readonly 'aria-autocomplete': "list";
            readonly 'aria-controls': string;
            readonly 'aria-expanded': boolean;
            readonly 'aria-labelledby': string;
            readonly id: string;
            readonly role: "combobox";
            readonly disabled: true | undefined;
            readonly type: "button" | undefined;
        }, string>, import("svelte/store").Writable<string>], (node: HTMLElement) => MeltActionReturn<ComboboxEvents['input']>, ([$trigger, $inputValue]: [{
            readonly 'aria-activedescendant': string | undefined;
            readonly 'aria-autocomplete': "list";
            readonly 'aria-controls': string;
            readonly 'aria-expanded': boolean;
            readonly 'aria-labelledby': string;
            readonly id: string;
            readonly role: "combobox";
            readonly disabled: true | undefined;
            readonly type: "button" | undefined;
        } & {
            [x: `data-melt-${string}`]: "";
        } & {
            action: (node: HTMLElement) => MeltActionReturn<"input" | "click" | "keydown">;
        }, string]) => {
            readonly role: "combobox";
            readonly value: string;
            readonly autocomplete: "off";
            readonly disabled: true | undefined;
            readonly type: "button" | undefined;
            readonly 'aria-expanded': boolean;
            readonly 'aria-controls': string;
            readonly 'aria-activedescendant': string | undefined;
            readonly 'aria-autocomplete': "list";
            readonly 'aria-labelledby': string;
            readonly id: string;
        }, string>;
        label: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<"mousedown">, ([$labelId, $triggerId]: [string, string]) => {
            id: string;
            for: string;
        }, string>;
        menu: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<"pointerleave">, ([$isVisible, $menuId]: [boolean, string]) => {
            readonly hidden: true | undefined;
            readonly id: string;
            readonly role: "listbox";
            readonly style: string;
        }, string>;
        option: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<(value: unknown) => boolean>], (node: HTMLElement) => MeltActionReturn<"click" | "pointermove">, ([$isSelected]: [(value: unknown) => boolean]) => (props: import("./types.js").ComboboxOptionProps<unknown>) => {
            readonly 'data-value': string;
            readonly 'data-label': string | undefined;
            readonly 'data-disabled': true | undefined;
            readonly 'aria-disabled': true | undefined;
            readonly 'aria-selected': boolean;
            readonly 'data-selected': "" | undefined;
            readonly id: string;
            readonly role: "option";
        }, string>;
        group: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            role: string;
            'aria-labelledby': string;
        }, string>;
        arrow: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<number | undefined>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number | undefined) => {
            'data-arrow': boolean;
            style: string;
        }, string>;
        groupLabel: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            id: string;
        }, string>;
        hiddenInput: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            'aria-hidden': "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            /** Action and attributes for the text input. */
            style: string;
        }, string>;
    };
    states: {
        touchedInput: import("svelte/store").Writable<boolean>;
        inputValue: import("svelte/store").Writable<string>;
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
        highlighted: import("svelte/store").Readable<import("./types.js").ComboboxOption<unknown> | undefined>;
        highlightedItem: import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<HTMLElement | null>>;
    };
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        label: string;
        menu: string;
        trigger: string;
    }>;
    helpers: {
        isSelected: import("svelte/store").Readable<(value: unknown) => boolean>;
        isHighlighted: import("svelte/store").Readable<(item: unknown) => boolean>;
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
