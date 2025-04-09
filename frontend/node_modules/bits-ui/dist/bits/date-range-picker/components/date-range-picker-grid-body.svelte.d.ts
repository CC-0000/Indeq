import { SvelteComponent } from "svelte";
import type { GridBodyProps } from "../index.js";
declare const __propDef: {
    props: GridBodyProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerGridBodyProps = typeof __propDef.props;
export type DateRangePickerGridBodyEvents = typeof __propDef.events;
export type DateRangePickerGridBodySlots = typeof __propDef.slots;
export default class DateRangePickerGridBody extends SvelteComponent<DateRangePickerGridBodyProps, DateRangePickerGridBodyEvents, DateRangePickerGridBodySlots> {
}
export {};
