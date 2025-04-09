import { SvelteComponent } from "svelte";
import type { GridProps } from "../index.js";
declare const __propDef: {
    props: GridProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                tabindex: number;
                role: string;
                'aria-readonly': "true" | undefined;
                'aria-disabled': "true" | undefined;
                'data-readonly': string | undefined;
                'data-disabled': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerGridProps = typeof __propDef.props;
export type DateRangePickerGridEvents = typeof __propDef.events;
export type DateRangePickerGridSlots = typeof __propDef.slots;
export default class DateRangePickerGrid extends SvelteComponent<DateRangePickerGridProps, DateRangePickerGridEvents, DateRangePickerGridSlots> {
}
export {};
