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
                role: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type RangeCalendarCellProps = typeof __propDef.props;
export type RangeCalendarCellEvents = typeof __propDef.events;
export type RangeCalendarCellSlots = typeof __propDef.slots;
export default class RangeCalendarCell extends SvelteComponent<RangeCalendarCellProps, RangeCalendarCellEvents, RangeCalendarCellSlots> {
}
export {};
