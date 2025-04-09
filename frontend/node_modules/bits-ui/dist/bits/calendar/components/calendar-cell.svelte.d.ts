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
                "aria-disabled": boolean | undefined;
                "data-disabled": string | undefined;
                role: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type CalendarCellProps = typeof __propDef.props;
export type CalendarCellEvents = typeof __propDef.events;
export type CalendarCellSlots = typeof __propDef.slots;
export default class CalendarCell extends SvelteComponent<CalendarCellProps, CalendarCellEvents, CalendarCellSlots> {
}
export {};
