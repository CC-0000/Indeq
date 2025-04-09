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
export type CheckboxInputProps = typeof __propDef.props;
export type CheckboxInputEvents = typeof __propDef.events;
export type CheckboxInputSlots = typeof __propDef.slots;
export default class CheckboxInput extends SvelteComponent<CheckboxInputProps, CheckboxInputEvents, CheckboxInputSlots> {
}
export {};
