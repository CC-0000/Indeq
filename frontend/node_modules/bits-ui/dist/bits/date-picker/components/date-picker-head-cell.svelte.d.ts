import { SvelteComponent } from "svelte";
import type { HeadCellProps } from "../index.js";
declare const __propDef: {
    props: HeadCellProps;
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
export type DatePickerHeadCellProps = typeof __propDef.props;
export type DatePickerHeadCellEvents = typeof __propDef.events;
export type DatePickerHeadCellSlots = typeof __propDef.slots;
export default class DatePickerHeadCell extends SvelteComponent<DatePickerHeadCellProps, DatePickerHeadCellEvents, DatePickerHeadCellSlots> {
}
export {};
