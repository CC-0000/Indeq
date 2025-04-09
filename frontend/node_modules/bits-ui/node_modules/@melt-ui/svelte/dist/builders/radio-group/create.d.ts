/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import type { RadioGroupEvents } from './events.js';
import type { CreateRadioGroupProps, RadioGroupItemProps } from './types.js';
export declare function createRadioGroup(props?: CreateRadioGroupProps): {
    elements: {
        root: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("../../internal/types.js").Orientation>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$required, $orientation]: [boolean, import("../../internal/types.js").Orientation]) => {
            readonly role: "radiogroup";
            readonly 'aria-required': boolean;
            readonly 'data-orientation': import("../../internal/types.js").Orientation;
        }, string>;
        item: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: import("svelte/store").Updater<string>, sideEffect?: ((newValue: string) => void) | undefined) => void;
            set: (this: void, value: string) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined): import("svelte/store").Unsubscriber;
            get: () => string;
            destroy?: (() => void) | undefined;
        }, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("../../internal/types.js").Orientation>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => MeltActionReturn<RadioGroupEvents['item']>, ([$value, $orientation, $disabled]: [string, import("../../internal/types.js").Orientation, boolean]) => (props: RadioGroupItemProps) => {
            readonly disabled: boolean;
            readonly 'data-value': string;
            readonly 'data-orientation': import("../../internal/types.js").Orientation;
            readonly 'data-disabled': true | undefined;
            readonly 'data-state': "checked" | "unchecked";
            readonly 'aria-checked': boolean;
            readonly type: "button";
            readonly role: "radio";
            readonly tabindex: 0 | -1;
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
            update: (updater: import("svelte/store").Updater<string>, sideEffect?: ((newValue: string) => void) | undefined) => void;
            set: (this: void, value: string) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined): import("svelte/store").Unsubscriber;
            get: () => string;
            destroy?: (() => void) | undefined;
        };
    };
    helpers: {
        isChecked: import("svelte/store").Readable<(itemValue: string) => boolean>;
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        disabled: boolean;
        required: boolean;
        loop: boolean;
        orientation: import("../../internal/types.js").Orientation;
        defaultValue: string | undefined;
        value?: import("svelte/store").Writable<string> | undefined;
        onValueChange?: import("../../internal/helpers/index.js").ChangeFn<string> | undefined;
    }, "value">>;
};
