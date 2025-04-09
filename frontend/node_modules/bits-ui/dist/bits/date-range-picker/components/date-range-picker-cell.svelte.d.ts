import { SvelteComponent } from "svelte";
import type { CellProps } from "../index.js";
declare const __propDef: {
    props: CellProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: {
                "aria-disabled": boolean;
                "data-disabled": string | undefined;
                role: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerCellProps = typeof __propDef.props;
export type DateRangePickerCellEvents = typeof __propDef.events;
export type DateRangePickerCellSlots = typeof __propDef.slots;
export default class DateRangePickerCell extends SvelteComponent<DateRangePickerCellProps, DateRangePickerCellEvents, DateRangePickerCellSlots> {
}
export {};
