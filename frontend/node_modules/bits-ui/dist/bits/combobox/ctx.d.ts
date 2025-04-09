import { type CreateComboboxProps } from "@melt-ui/svelte";
import type { Writable } from "svelte/store";
import type { FloatingProps } from "../floating/_types.js";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function getCtx(): GetReturn;
type Items<T> = {
    value: T;
    label?: string | undefined;
};
type Props<T = unknown, M extends boolean = false> = CreateComboboxProps<T, M> & {
    items?: Items<T>[] | undefined;
};
export declare function setCtx<T = unknown, M extends boolean = false>(props: Props<T, M>): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "label" | "menu" | "input" | "content" | "item" | "group" | "indicator" | "group-label" | "arrow" | "hidden-input") => Record<string, string> | undefined;
    elements: {
        input: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<HTMLElement | null>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"input" | "click" | "keydown">, ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]: [boolean, HTMLElement | null, boolean, string, string, string]) => {
            readonly "aria-activedescendant": string | undefined;
            readonly "aria-autocomplete": "list";
            readonly "aria-controls": string;
            readonly "aria-expanded": boolean;
            readonly "aria-labelledby": string;
            readonly id: string;
            readonly role: "combobox";
            readonly disabled: true | undefined;
            readonly type: "button" | undefined;
        }, string>, import("svelte/store").Writable<string>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/combobox/events.js").ComboboxEvents["input"]>, ([$trigger, $inputValue]: [{
            readonly "aria-activedescendant": string | undefined;
            readonly "aria-autocomplete": "list";
            readonly "aria-controls": string;
            readonly "aria-expanded": boolean;
            readonly "aria-labelledby": string;
            readonly id: string;
            readonly role: "combobox";
            readonly disabled: true | undefined;
            readonly type: "button" | undefined;
        } & {
            [x: `data-melt-${string}`]: "";
        } & {
            action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"input" | "click" | "keydown">;
        }, string]) => {
            readonly role: "combobox";
            readonly value: string;
            readonly autocomplete: "off";
            readonly disabled: true | undefined;
            readonly type: "button" | undefined;
            readonly "aria-expanded": boolean;
            readonly "aria-controls": string;
            readonly "aria-activedescendant": string | undefined;
            readonly "aria-autocomplete": "list";
            readonly "aria-labelledby": string;
            readonly id: string;
        }, string>;
        label: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"mousedown">, ([$labelId, $triggerId]: [string, string]) => {
            id: string;
            for: string;
        }, string>;
        menu: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"pointerleave">, ([$isVisible, $menuId]: [boolean, string]) => {
            readonly hidden: true | undefined;
            readonly id: string;
            readonly role: "listbox";
            readonly style: string;
        }, string>;
        option: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<(value: unknown) => boolean>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "pointermove">, ([$isSelected]: [(value: unknown) => boolean]) => (props: import("@melt-ui/svelte/index.js").ComboboxOptionProps<unknown>) => {
            readonly "data-value": string;
            readonly "data-label": string | undefined;
            readonly "data-disabled": true | undefined;
            readonly "aria-disabled": true | undefined;
            readonly "aria-selected": boolean;
            readonly "data-selected": "" | undefined;
            readonly id: string;
            readonly role: "option";
        }, string>;
        group: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            role: string;
            "aria-labelledby": string;
        }, string>;
        arrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number | undefined>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number | undefined) => {
            "data-arrow": boolean;
            style: string;
        }, string>;
        groupLabel: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            id: string;
        }, string>;
        hiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            "aria-hidden": "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
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
            update: (updater: import("svelte/store").Updater<import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined>, sideEffect?: ((newValue: import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined) => void) | undefined) => void;
            set: (this: void, value: import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined>, invalidate?: import("svelte/store").Invalidator<import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined;
            destroy?: (() => void) | undefined;
        };
        highlighted: import("svelte/store").Readable<import("@melt-ui/svelte/index.js").ComboboxOption<unknown> | undefined>;
        highlightedItem: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<HTMLElement | null>>;
    };
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        label: string;
        menu: string;
        trigger: string;
    }>;
    helpers: {
        isSelected: import("svelte/store").Readable<(value: unknown) => boolean>;
        isHighlighted: import("svelte/store").Readable<(item: unknown) => boolean>;
        closeMenu: () => void;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        multiple: M;
        disabled: boolean;
        forceVisible: boolean;
        name: string | undefined;
        preventScroll: boolean;
        portal: string | HTMLElement | null | undefined;
        required: boolean;
        onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
        positioning: import("@melt-ui/svelte/internal/actions").FloatingConfig | {
            placement: "bottom";
            sameWidth: true;
        };
        arrowSize?: number | undefined;
        scrollAlignment: "center" | "nearest";
        loop: boolean;
        defaultSelected?: import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined;
        selected?: Writable<import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>>> | undefined;
        onSelectedChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@melt-ui/svelte/internal/types").WhenTrue<M, import("@melt-ui/svelte/index.js").ComboboxOption<T>[], import("@melt-ui/svelte/index.js").ComboboxOption<T>, import("@melt-ui/svelte/index.js").ComboboxOption<T>[] | import("@melt-ui/svelte/index.js").ComboboxOption<T>> | undefined> | undefined;
        closeOnOutsideClick: boolean;
        closeOnEscape: boolean;
        onOutsideClick: ((event: import("@melt-ui/svelte/index.js").InteractOutsideEvent) => void) | undefined;
        typeahead: boolean;
        highlightOnHover: boolean;
    }>;
};
export declare function setGroupCtx(): {
    group: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
        role: string;
        "aria-labelledby": string;
    }, string>;
    id: string;
    getAttrs: (part: "label" | "menu" | "input" | "content" | "item" | "group" | "indicator" | "group-label" | "arrow" | "hidden-input") => Record<string, string> | undefined;
};
export declare function setItemCtx(value: unknown): GetReturn;
export declare function getGroupLabel(): {
    groupLabel: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
        id: string;
    }, string>;
    id: string;
    getAttrs: (part: "label" | "menu" | "input" | "content" | "item" | "group" | "indicator" | "group-label" | "arrow" | "hidden-input") => Record<string, string> | undefined;
};
export declare function getItemIndicator(): {
    value: unknown;
    isSelected: import("svelte/store").Readable<(value: unknown) => boolean>;
    getAttrs: (part: "label" | "menu" | "input" | "content" | "item" | "group" | "indicator" | "group-label" | "arrow" | "hidden-input") => Record<string, string> | undefined;
};
export declare function setArrow(size?: number): GetReturn;
export declare function updatePositioning(props: FloatingProps): void;
export {};
