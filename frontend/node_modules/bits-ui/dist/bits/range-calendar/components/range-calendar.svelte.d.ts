import { SvelteComponent } from "svelte";
import { type Month } from "@melt-ui/svelte";
import type { DateValue } from "@internationalized/date";
import type { Events, Props } from "../index.js";
declare const __propDef: {
    props: Props;
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
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/range-calendar/events.js").RangeCalendarEvents["calendar"]>;
            };
            months: Month<DateValue>[];
            weekdays: string[];
            startValue: DateValue | undefined;
            endValue: DateValue | undefined;
        };
    };
    events: Events;
};
export type RangeCalendarProps = typeof __propDef.props;
export type RangeCalendarEvents = typeof __propDef.events;
export type RangeCalendarSlots = typeof __propDef.slots;
export default class RangeCalendar extends SvelteComponent<RangeCalendarProps, RangeCalendarEvents, RangeCalendarSlots> {
}
export {};
