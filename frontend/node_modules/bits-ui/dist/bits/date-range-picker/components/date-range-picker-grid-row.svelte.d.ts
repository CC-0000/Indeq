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
export type DateRangePickerGridRowProps = typeof __propDef.props;
export type DateRangePickerGridRowEvents = typeof __propDef.events;
export type DateRangePickerGridRowSlots = typeof __propDef.slots;
export default class DateRangePickerGridRow extends SvelteComponent<DateRangePickerGridRowProps, DateRangePickerGridRowEvents, DateRangePickerGridRowSlots> {
}
export {};
