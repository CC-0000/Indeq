import { SvelteComponent } from "svelte";
import { type Month } from "@melt-ui/svelte";
import type { DateValue } from "@internationalized/date";
import type { CalendarProps } from "../index.js";
declare const __propDef: {
    props: CalendarProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                id: string;
                role: string;
                'aria-label': string;
                'data-invalid': string | undefined;
                'data-disabled': string | undefined;
                'data-readonly': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"keydown">;
            };
            months: Month<DateValue>[];
            weekdays: string[];
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerCalendarProps = typeof __propDef.props;
export type DateRangePickerCalendarEvents = typeof __propDef.events;
export type DateRangePickerCalendarSlots = typeof __propDef.slots;
export default class DateRangePickerCalendar extends SvelteComponent<DateRangePickerCalendarProps, DateRangePickerCalendarEvents, DateRangePickerCalendarSlots> {
}
export {};
