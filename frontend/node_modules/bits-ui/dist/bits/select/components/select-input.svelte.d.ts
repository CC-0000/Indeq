import { SvelteComponent } from "svelte";
import type { InputProps } from "../index.js";
declare const __propDef: {
    props: InputProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                name: string | undefined;
                value: string;
                'aria-hidden': "true";
                hidden: boolean;
                disabled: boolean;
                required: boolean;
                tabIndex: number;
                style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLInputElement) => {
                    destroy: import("svelte/store").Unsubscriber;
                };
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SelectInputProps = typeof __propDef.props;
export type SelectInputEvents = typeof __propDef.events;
export type SelectInputSlots = typeof __propDef.slots;
export default class SelectInput extends SvelteComponent<SelectInputProps, SelectInputEvents, SelectInputSlots> {
}
export {};
