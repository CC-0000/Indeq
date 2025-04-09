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
export type RangeCalendarGridRowProps = typeof __propDef.props;
export type RangeCalendarGridRowEvents = typeof __propDef.events;
export type RangeCalendarGridRowSlots = typeof __propDef.slots;
export default class RangeCalendarGridRow extends SvelteComponent<RangeCalendarGridRowProps, RangeCalendarGridRowEvents, RangeCalendarGridRowSlots> {
}
export {};
