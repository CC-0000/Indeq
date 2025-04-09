import { SvelteComponent } from "svelte";
import type { LabelProps } from "../index.js";
declare const __propDef: {
    props: LabelProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ComboboxLabelProps = typeof __propDef.props;
export type ComboboxLabelEvents = typeof __propDef.events;
export type ComboboxLabelSlots = typeof __propDef.slots;
export default class ComboboxLabel extends SvelteComponent<ComboboxLabelProps, ComboboxLabelEvents, ComboboxLabelSlots> {
}
export {};
