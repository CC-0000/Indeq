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
export type CalendarHeadCellProps = typeof __propDef.props;
export type CalendarHeadCellEvents = typeof __propDef.events;
export type CalendarHeadCellSlots = typeof __propDef.slots;
export default class CalendarHeadCell extends SvelteComponent<CalendarHeadCellProps, CalendarHeadCellEvents, CalendarHeadCellSlots> {
}
export {};
