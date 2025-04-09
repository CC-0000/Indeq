import { SvelteComponent } from "svelte";
import type { NextButtonProps } from "../index.js";
declare const __propDef: {
    props: NextButtonProps;
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
export type DateRangePickerNextButtonProps = typeof __propDef.props;
export type DateRangePickerNextButtonEvents = typeof __propDef.events;
export type DateRangePickerNextButtonSlots = typeof __propDef.slots;
export default class DateRangePickerNextButton extends SvelteComponent<DateRangePickerNextButtonProps, DateRangePickerNextButtonEvents, DateRangePickerNextButtonSlots> {
}
export {};
