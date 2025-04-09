import { SvelteComponent } from "svelte";
import type { HiddenInputProps } from "../index.js";
declare const __propDef: {
    props: HiddenInputProps;
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
export type PinInputHiddenInputProps = typeof __propDef.props;
export type PinInputHiddenInputEvents = typeof __propDef.events;
export type PinInputHiddenInputSlots = typeof __propDef.slots;
export default class PinInputHiddenInput extends SvelteComponent<PinInputHiddenInputProps, PinInputHiddenInputEvents, PinInputHiddenInputSlots> {
}
export {};
