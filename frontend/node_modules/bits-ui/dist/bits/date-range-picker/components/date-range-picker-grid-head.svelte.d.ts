import { SvelteComponent } from "svelte";
import type { GridHeadProps } from "../index.js";
declare const __propDef: {
    props: GridHeadProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerGridHeadProps = typeof __propDef.props;
export type DateRangePickerGridHeadEvents = typeof __propDef.events;
export type DateRangePickerGridHeadSlots = typeof __propDef.slots;
export default class DateRangePickerGridHead extends SvelteComponent<DateRangePickerGridHeadProps, DateRangePickerGridHeadEvents, DateRangePickerGridHeadSlots> {
}
export {};
