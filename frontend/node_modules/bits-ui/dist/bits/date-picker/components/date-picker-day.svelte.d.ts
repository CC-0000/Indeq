import { SvelteComponent } from "svelte";
import type { DayEvents, DayProps } from "../index.js";
declare const __propDef: {
    props: DayProps;
    slots: {
        default: {
            builder: {
                readonly role: "button";
                readonly 'aria-label': string;
                readonly 'aria-selected': true | undefined;
                readonly 'aria-disabled': true | undefined;
                readonly 'data-selected': true | undefined;
                readonly 'data-value': string;
                readonly 'data-disabled': "" | undefined;
                readonly 'data-unavailable': "" | undefined;
                readonly 'data-today': "" | undefined;
                readonly 'data-outside-month': "" | undefined;
                readonly 'data-outside-visible-months': "" | undefined;
                readonly 'data-focused': "" | undefined;
                readonly tabindex: 0 | -1 | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click">;
            };
            disabled: boolean;
            unavailable: boolean | undefined;
            selected: boolean;
        };
    };
    events: DayEvents;
};
export type DatePickerDayProps = typeof __propDef.props;
export type DatePickerDayEvents = typeof __propDef.events;
export type DatePickerDaySlots = typeof __propDef.slots;
export default class DatePickerDay extends SvelteComponent<DatePickerDayProps, DatePickerDayEvents, DatePickerDaySlots> {
}
export {};
