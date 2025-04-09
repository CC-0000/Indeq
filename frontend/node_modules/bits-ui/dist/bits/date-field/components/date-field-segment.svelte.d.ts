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
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/date-field/events.js").DateFieldEvents["segment"]>;
            };
        };
    };
    events: SegmentEvents;
};
export type DateFieldSegmentProps = typeof __propDef.props;
export type DateFieldSegmentEvents = typeof __propDef.events;
export type DateFieldSegmentSlots = typeof __propDef.slots;
export default class DateFieldSegment extends SvelteComponent<DateFieldSegmentProps, DateFieldSegmentEvents, DateFieldSegmentSlots> {
}
export {};
