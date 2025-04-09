import { SvelteComponent } from "svelte";
import type { DateValue } from "@internationalized/date";
import { type Month } from "@melt-ui/svelte";
import type { Props } from "../index.js";
declare class __sveltets_Render<Multiple extends boolean> {
    props(): Props<Multiple>;
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            months: Month<DateValue>[];
            weekdays: string[];
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
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/calendar/events.js").CalendarEvents["calendar"]>;
            };
        };
    };
}
export type CalendarProps<Multiple extends boolean> = ReturnType<__sveltets_Render<Multiple>['props']>;
export type CalendarEvents<Multiple extends boolean> = ReturnType<__sveltets_Render<Multiple>['events']>;
export type CalendarSlots<Multiple extends boolean> = ReturnType<__sveltets_Render<Multiple>['slots']>;
export default class Calendar<Multiple extends boolean> extends SvelteComponent<CalendarProps<Multiple>, CalendarEvents<Multiple>, CalendarSlots<Multiple>> {
}
export {};
