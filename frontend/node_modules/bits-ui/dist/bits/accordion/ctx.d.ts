import { type CreateAccordionProps } from "@melt-ui/svelte";
import { type Writable } from "svelte/store";
import type { ItemProps } from "./index.js";
export declare function setCtx<Multiple extends boolean>(props: CreateAccordionProps<Multiple>): {
    getAttrs: (part: "header" | "root" | "content" | "item" | "trigger") => Record<string, string> | undefined;
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    ids: {
        [x: string]: string;
    };
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
            "data-melt-id": string;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/action").Action<any, any, Record<never, any>>, ($value: string | string[] | undefined) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/accordion/events.js").AccordionEvents["trigger"]>, ([$value, $disabled]: [string | string[] | undefined, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            disabled: boolean | undefined;
            "aria-expanded": boolean;
            "aria-disabled": boolean;
            "data-disabled": boolean | undefined;
            "data-value": string;
            "data-state": string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => void, ([$value, $disabled, $forceVisible]: [string | string[] | undefined, boolean, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
            "data-value": string;
            hidden: boolean | undefined;
            style: string;
        }, string>;
        heading: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (props: import("@melt-ui/svelte/index.js").AccordionHeadingProps) => {
            role: string;
            "aria-level": number;
            "data-heading-level": number;
        }, string>;
    };
    states: {
        value: Writable<import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, string[], string, string | string[]> | undefined>;
    };
    helpers: {
        isSelected: import("svelte/store").Readable<(key: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        multiple: false | Multiple;
        disabled: boolean;
        forceVisible: boolean;
        defaultValue?: import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, string[], string, string | string[]> | undefined;
        value?: Writable<import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, string[], string, string | string[]> | undefined> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, string[], string, string | string[]> | undefined> | undefined;
    }, "value" | "defaultValue" | "onValueChange">>;
};
export declare function getCtx(): {
    getAttrs: (part: "header" | "root" | "content" | "item" | "trigger") => Record<string, string> | undefined;
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    ids: {
        [x: string]: string;
    };
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
            "data-melt-id": string;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/action").Action<any, any, Record<never, any>>, ($value: string | string[] | undefined) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/accordion/events.js").AccordionEvents["trigger"]>, ([$value, $disabled]: [string | string[] | undefined, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            disabled: boolean | undefined;
            "aria-expanded": boolean;
            "aria-disabled": boolean;
            "data-disabled": boolean | undefined;
            "data-value": string;
            "data-state": string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => void, ([$value, $disabled, $forceVisible]: [string | string[] | undefined, boolean, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
            "data-value": string;
            hidden: boolean | undefined;
            style: string;
        }, string>;
        heading: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (props: import("@melt-ui/svelte/index.js").AccordionHeadingProps) => {
            role: string;
            "aria-level": number;
            "data-heading-level": number;
        }, string>;
    };
    states: {
        value: Writable<string | string[] | undefined>;
    };
    helpers: {
        isSelected: import("svelte/store").Readable<(key: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        multiple: boolean;
        disabled: boolean;
        forceVisible: boolean;
        defaultValue?: string | string[] | undefined;
        value?: Writable<string | string[] | undefined> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string | string[] | undefined> | undefined;
    }, "value" | "defaultValue" | "onValueChange">>;
};
export declare function setItem(props: ItemProps): {
    propsStore: Writable<ItemProps>;
    getAttrs: (part: "header" | "root" | "content" | "item" | "trigger") => Record<string, string> | undefined;
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    ids: {
        [x: string]: string;
    };
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
            "data-melt-id": string;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/action").Action<any, any, Record<never, any>>, ($value: string | string[] | undefined) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/accordion/events.js").AccordionEvents["trigger"]>, ([$value, $disabled]: [string | string[] | undefined, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            disabled: boolean | undefined;
            "aria-expanded": boolean;
            "aria-disabled": boolean;
            "data-disabled": boolean | undefined;
            "data-value": string;
            "data-state": string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => void, ([$value, $disabled, $forceVisible]: [string | string[] | undefined, boolean, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
            "data-value": string;
            hidden: boolean | undefined;
            style: string;
        }, string>;
        heading: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (props: import("@melt-ui/svelte/index.js").AccordionHeadingProps) => {
            role: string;
            "aria-level": number;
            "data-heading-level": number;
        }, string>;
    };
    states: {
        value: Writable<string | string[] | undefined>;
    };
    helpers: {
        isSelected: import("svelte/store").Readable<(key: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        multiple: boolean;
        disabled: boolean;
        forceVisible: boolean;
        defaultValue?: string | string[] | undefined;
        value?: Writable<string | string[] | undefined> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string | string[] | undefined> | undefined;
    }, "value" | "defaultValue" | "onValueChange">>;
};
export declare function getItemProps(): {
    propsStore: Writable<ItemProps>;
};
export declare function getContent(): {
    propsStore: Writable<ItemProps>;
    getAttrs: (part: "header" | "root" | "content" | "item" | "trigger") => Record<string, string> | undefined;
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    ids: {
        [x: string]: string;
    };
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
            "data-melt-id": string;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/action").Action<any, any, Record<never, any>>, ($value: string | string[] | undefined) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/accordion/events.js").AccordionEvents["trigger"]>, ([$value, $disabled]: [string | string[] | undefined, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            disabled: boolean | undefined;
            "aria-expanded": boolean;
            "aria-disabled": boolean;
            "data-disabled": boolean | undefined;
            "data-value": string;
            "data-state": string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => void, ([$value, $disabled, $forceVisible]: [string | string[] | undefined, boolean, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
            "data-value": string;
            hidden: boolean | undefined;
            style: string;
        }, string>;
        heading: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (props: import("@melt-ui/svelte/index.js").AccordionHeadingProps) => {
            role: string;
            "aria-level": number;
            "data-heading-level": number;
        }, string>;
    };
    states: {
        value: Writable<string | string[] | undefined>;
    };
    helpers: {
        isSelected: import("svelte/store").Readable<(key: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        multiple: boolean;
        disabled: boolean;
        forceVisible: boolean;
        defaultValue?: string | string[] | undefined;
        value?: Writable<string | string[] | undefined> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string | string[] | undefined> | undefined;
    }, "value" | "defaultValue" | "onValueChange">>;
};
export declare function getTrigger(): {
    props: Writable<ItemProps>;
    getAttrs: (part: "header" | "root" | "content" | "item" | "trigger") => Record<string, string> | undefined;
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    ids: {
        [x: string]: string;
    };
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
            "data-melt-id": string;
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/action").Action<any, any, Record<never, any>>, ($value: string | string[] | undefined) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/accordion/events.js").AccordionEvents["trigger"]>, ([$value, $disabled]: [string | string[] | undefined, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            disabled: boolean | undefined;
            "aria-expanded": boolean;
            "aria-disabled": boolean;
            "data-disabled": boolean | undefined;
            "data-value": string;
            "data-state": string;
        }, string>;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string | string[] | undefined>, sideEffect?: ((newValue: string | string[] | undefined) => void) | undefined) => void;
            set: (this: void, value: string | string[] | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string | string[] | undefined>, invalidate?: import("svelte/store").Invalidator<string | string[] | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => string | string[] | undefined;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => void, ([$value, $disabled, $forceVisible]: [string | string[] | undefined, boolean, boolean]) => (props: import("@melt-ui/svelte/index.js").AccordionItemProps) => {
            "data-state": string;
            "data-disabled": boolean | undefined;
            "data-value": string;
            hidden: boolean | undefined;
            style: string;
        }, string>;
        heading: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (props: import("@melt-ui/svelte/index.js").AccordionHeadingProps) => {
            role: string;
            "aria-level": number;
            "data-heading-level": number;
        }, string>;
    };
    states: {
        value: Writable<string | string[] | undefined>;
    };
    helpers: {
        isSelected: import("svelte/store").Readable<(key: string) => boolean>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        multiple: boolean;
        disabled: boolean;
        forceVisible: boolean;
        defaultValue?: string | string[] | undefined;
        value?: Writable<string | string[] | undefined> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<string | string[] | undefined> | undefined;
    }, "value" | "defaultValue" | "onValueChange">>;
};
