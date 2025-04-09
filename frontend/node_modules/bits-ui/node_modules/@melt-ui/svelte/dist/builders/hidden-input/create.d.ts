/// <reference types="svelte" />
import type { CreateHiddenInputProps } from './types.js';
import type { Readable } from 'svelte/motion';
export declare function createHiddenInput(props: CreateHiddenInputProps): import("../../internal/helpers/makeElement.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<string>>, Readable<string | undefined>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
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
