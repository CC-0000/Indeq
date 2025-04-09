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
export type RangeCalendarGridHeadProps = typeof __propDef.props;
export type RangeCalendarGridHeadEvents = typeof __propDef.events;
export type RangeCalendarGridHeadSlots = typeof __propDef.slots;
export default class RangeCalendarGridHead extends SvelteComponent<RangeCalendarGridHeadProps, RangeCalendarGridHeadEvents, RangeCalendarGridHeadSlots> {
}
export {};
