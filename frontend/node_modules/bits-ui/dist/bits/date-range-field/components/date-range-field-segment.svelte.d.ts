import { SvelteComponent } from "svelte";
import type { SegmentProps } from "../index.js";
declare const __propDef: {
    props: SegmentProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                'aria-invalid': "true" | undefined;
                'aria-disabled': "true" | undefined;
                'aria-readonly': "true" | undefined;
                'data-invalid': string | undefined;
                'data-disabled': string | undefined;
                'data-segment': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangeFieldSegmentProps = typeof __propDef.props;
export type DateRangeFieldSegmentEvents = typeof __propDef.events;
export type DateRangeFieldSegmentSlots = typeof __propDef.slots;
export default class DateRangeFieldSegment extends SvelteComponent<DateRangeFieldSegmentProps, DateRangeFieldSegmentEvents, DateRangeFieldSegmentSlots> {
}
export {};
