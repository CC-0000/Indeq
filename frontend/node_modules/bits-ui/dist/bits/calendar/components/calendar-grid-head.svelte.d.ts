import { SvelteComponent } from "svelte";
import type { GridHeadProps } from "../index.js";
declare const __propDef: {
    props: GridHeadProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: {
                "aria-hidden": boolean;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type CalendarGridHeadProps = typeof __propDef.props;
export type CalendarGridHeadEvents = typeof __propDef.events;
export type CalendarGridHeadSlots = typeof __propDef.slots;
export default class CalendarGridHead extends SvelteComponent<CalendarGridHeadProps, CalendarGridHeadEvents, CalendarGridHeadSlots> {
}
export {};
