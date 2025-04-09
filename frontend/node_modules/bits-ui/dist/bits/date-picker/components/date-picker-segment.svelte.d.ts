import { SvelteComponent } from "svelte";
import type { SegmentEvents, SegmentProps } from "../index.js";
declare const __propDef: {
    props: SegmentProps;
    slots: {
        default: {
            builder: ({
                'aria-invalid': "true" | undefined;
                'aria-disabled': "true" | undefined;
                'aria-readonly': "true" | undefined;
                'data-invalid': string | undefined;
                'data-disabled': string | undefined;
                'data-segment': string;
            } | {
                id: string;
                'aria-labelledby': string;
                contenteditable: boolean;
                'aria-describedby': string | undefined;
                tabindex: number | undefined;
                'aria-invalid': "true" | undefined;
                'aria-disabled': "true" | undefined;
                'aria-readonly': "true" | undefined;
                'data-invalid': string | undefined;
                'data-disabled': string | undefined;
                'data-segment': string;
            }) & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">;
            };
        };
    };
    events: SegmentEvents;
};
export type DatePickerSegmentProps = typeof __propDef.props;
export type DatePickerSegmentEvents = typeof __propDef.events;
export type DatePickerSegmentSlots = typeof __propDef.slots;
export default class DatePickerSegment extends SvelteComponent<DatePickerSegmentProps, DatePickerSegmentEvents, DatePickerSegmentSlots> {
}
export {};
