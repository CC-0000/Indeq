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
export type RangeCalendarHeadCellProps = typeof __propDef.props;
export type RangeCalendarHeadCellEvents = typeof __propDef.events;
export type RangeCalendarHeadCellSlots = typeof __propDef.slots;
export default class RangeCalendarHeadCell extends SvelteComponent<RangeCalendarHeadCellProps, RangeCalendarHeadCellEvents, RangeCalendarHeadCellSlots> {
}
export {};
