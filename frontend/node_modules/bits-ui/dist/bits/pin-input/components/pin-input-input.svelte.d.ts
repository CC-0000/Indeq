import { SvelteComponent } from "svelte";
import type { InputEvents, InputProps } from "../index.js";
declare const __propDef: {
    props: InputProps;
    slots: {
        default: {
            builder: {
                'data-complete': string | undefined;
                placeholder: string;
                disabled: boolean | undefined;
                type: "text" | "password";
                value: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLInputElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pin-input/events.js").PinInputEvents["input"]>;
            };
        };
    };
    events: InputEvents;
};
export type PinInputInputProps = typeof __propDef.props;
export type PinInputInputEvents = typeof __propDef.events;
export type PinInputInputSlots = typeof __propDef.slots;
export default class PinInputInput extends SvelteComponent<PinInputInputProps, PinInputInputEvents, PinInputInputSlots> {
}
export {};
