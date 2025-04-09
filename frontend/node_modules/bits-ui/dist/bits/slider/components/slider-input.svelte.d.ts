import { SvelteComponent } from "svelte";
import type { InputProps } from "../index.js";
declare const __propDef: {
    props: InputProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SliderInputProps = typeof __propDef.props;
export type SliderInputEvents = typeof __propDef.events;
export type SliderInputSlots = typeof __propDef.slots;
export default class SliderInput extends SvelteComponent<SliderInputProps, SliderInputEvents, SliderInputSlots> {
}
export {};
