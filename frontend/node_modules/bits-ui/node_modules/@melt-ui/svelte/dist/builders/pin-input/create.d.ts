/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import type { PinInputEvents } from './events.js';
import type { CreatePinInputProps } from './types.js';
export declare const pinInputIdParts: readonly ["root"];
export type PinInputIdParts = typeof pinInputIdParts;
export declare function createPinInput(props?: CreatePinInputProps): {
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        root: string;
    }>;
    elements: {
        root: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string[]>, sideEffect?: ((newValue: string[]) => void) | undefined) => void;
            set: (this: void, value: string[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string[]>, invalidate?: import("svelte/store").Invalidator<string[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => string[];
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$value, $rootId]: [string[], string]) => {
            id: string;
            'data-complete': string | undefined;
        }, string>;
        input: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string[]>, sideEffect?: ((newValue: string[]) => void) | undefined) => void;
            set: (this: void, value: string[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string[]>, invalidate?: import("svelte/store").Invalidator<string[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => string[];
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<"text" | "password">>], (node: HTMLInputElement) => MeltActionReturn<PinInputEvents['input']>, ([$value, $placeholder, $disabled, $type]: [string[], string, boolean, "text" | "password"]) => () => {
            'data-complete': string | undefined;
            placeholder: string;
            disabled: boolean | undefined;
            type: "text" | "password";
            value: string;
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
            style: string;
        }, string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<string[]>, sideEffect?: ((newValue: string[]) => void) | undefined) => void;
            set: (this: void, value: string[]) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string[]>, invalidate?: import("svelte/store").Invalidator<string[]> | undefined): import("svelte/store").Unsubscriber;
            get: () => string[];
            destroy?: (() => void) | undefined;
        };
        valueStr: import("svelte/store").Readable<string>;
    };
    helpers: {
        clear: () => void;
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        placeholder: string;
        name: string | undefined;
        disabled: boolean;
        type: "text" | "password";
        defaultValue: string[];
        value?: import("svelte/store").Writable<string[]> | undefined;
        onValueChange?: import("../../internal/helpers/index.js").ChangeFn<string[]> | undefined;
        ids?: Partial<{
            root: string;
        }> | undefined;
    }, "value" | "ids">>;
};
