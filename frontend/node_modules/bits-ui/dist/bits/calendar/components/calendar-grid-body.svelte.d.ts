import { SvelteComponent } from "svelte";
import type { GridBodyProps } from "../index.js";
declare const __propDef: {
    props: GridBodyProps;
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
export type CalendarGridBodyProps = typeof __propDef.props;
export type CalendarGridBodyEvents = typeof __propDef.events;
export type CalendarGridBodySlots = typeof __propDef.slots;
export default class CalendarGridBody extends SvelteComponent<CalendarGridBodyProps, CalendarGridBodyEvents, CalendarGridBodySlots> {
}
export {};
