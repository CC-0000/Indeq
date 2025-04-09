import { SvelteComponent } from "svelte";
import { type Month } from "@melt-ui/svelte";
import type { DateValue } from "@internationalized/date";
import type { CalendarEvents, CalendarProps } from "../index.js";
declare const __propDef: {
    props: CalendarProps;
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
    events: CalendarEvents;
};
export type DatePickerCalendarProps = typeof __propDef.props;
export type DatePickerCalendarEvents = typeof __propDef.events;
export type DatePickerCalendarSlots = typeof __propDef.slots;
export default class DatePickerCalendar extends SvelteComponent<DatePickerCalendarProps, DatePickerCalendarEvents, DatePickerCalendarSlots> {
}
export {};
