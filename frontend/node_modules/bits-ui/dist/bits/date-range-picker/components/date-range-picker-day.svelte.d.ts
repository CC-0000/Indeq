import { SvelteComponent } from "svelte";
import type { DayProps } from "../index.js";
declare const __propDef: {
    props: DayProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                readonly role: "button";
                readonly 'aria-label': string;
                readonly 'aria-selected': true | undefined;
                readonly 'aria-disabled': true | undefined;
                readonly 'data-selected': true | undefined;
                readonly 'data-selection-start': true | undefined;
                readonly 'data-selection-end': true | undefined;
                readonly 'data-value': string;
                readonly 'data-disabled': "" | undefined;
                readonly 'data-unavailable': "" | undefined;
                readonly 'data-today': "" | undefined;
                readonly 'data-outside-month': "" | undefined;
                readonly 'data-outside-visible-months': "" | undefined;
                readonly 'data-focused': "" | undefined;
                readonly 'data-highlighted': "" | undefined;
                readonly tabindex: 0 | -1 | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "mouseenter">;
            };
            disabled: boolean;
            unavailable: boolean;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerDayProps = typeof __propDef.props;
export type DateRangePickerDayEvents = typeof __propDef.events;
export type DateRangePickerDaySlots = typeof __propDef.slots;
export default class DateRangePickerDay extends SvelteComponent<DateRangePickerDayProps, DateRangePickerDayEvents, DateRangePickerDaySlots> {
}
export {};
