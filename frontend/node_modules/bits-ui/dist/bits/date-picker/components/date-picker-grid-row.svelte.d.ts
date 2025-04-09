import { SvelteComponent } from "svelte";
import type { GridRowProps } from "../index.js";
declare const __propDef: {
    props: GridRowProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: Record<string, string> | undefined;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DatePickerGridRowProps = typeof __propDef.props;
export type DatePickerGridRowEvents = typeof __propDef.events;
export type DatePickerGridRowSlots = typeof __propDef.slots;
export default class DatePickerGridRow extends SvelteComponent<DatePickerGridRowProps, DatePickerGridRowEvents, DatePickerGridRowSlots> {
}
export {};
