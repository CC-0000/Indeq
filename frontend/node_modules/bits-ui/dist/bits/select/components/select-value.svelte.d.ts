import { SvelteComponent } from "svelte";
import type { ValueProps } from "../index.js";
declare const __propDef: {
    props: ValueProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            label: string;
            attrs: Record<string, string> | undefined;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SelectValueProps = typeof __propDef.props;
export type SelectValueEvents = typeof __propDef.events;
export type SelectValueSlots = typeof __propDef.slots;
export default class SelectValue extends SvelteComponent<SelectValueProps, SelectValueEvents, SelectValueSlots> {
}
export {};
