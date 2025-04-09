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
export type RangeCalendarGridBodyProps = typeof __propDef.props;
export type RangeCalendarGridBodyEvents = typeof __propDef.events;
export type RangeCalendarGridBodySlots = typeof __propDef.slots;
export default class RangeCalendarGridBody extends SvelteComponent<RangeCalendarGridBodyProps, RangeCalendarGridBodyEvents, RangeCalendarGridBodySlots> {
}
export {};
