import { SvelteComponent } from "svelte";
import type { HeadCellProps } from "../index.js";
declare const __propDef: {
    props: HeadCellProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerHeadCellProps = typeof __propDef.props;
export type DateRangePickerHeadCellEvents = typeof __propDef.events;
export type DateRangePickerHeadCellSlots = typeof __propDef.slots;
export default class DateRangePickerHeadCell extends SvelteComponent<DateRangePickerHeadCellProps, DateRangePickerHeadCellEvents, DateRangePickerHeadCellSlots> {
}
export {};
