import { SvelteComponent } from "svelte";
import type { PrevButtonProps } from "../index.js";
declare const __propDef: {
    props: PrevButtonProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
                type: "button";
                'aria-label': string;
                'aria-disabled': "true" | undefined;
                disabled: boolean | undefined;
                'data-disabled': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click">;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerPrevButtonProps = typeof __propDef.props;
export type DateRangePickerPrevButtonEvents = typeof __propDef.events;
export type DateRangePickerPrevButtonSlots = typeof __propDef.slots;
export default class DateRangePickerPrevButton extends SvelteComponent<DateRangePickerPrevButtonProps, DateRangePickerPrevButtonEvents, DateRangePickerPrevButtonSlots> {
}
export {};
