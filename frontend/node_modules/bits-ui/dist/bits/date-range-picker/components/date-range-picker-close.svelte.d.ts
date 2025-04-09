import { SvelteComponent } from "svelte";
import type { CloseEvents, CloseProps } from "../index.js";
declare const __propDef: {
    props: CloseProps;
    slots: {
        default: {
            builder: {
                readonly type: "button";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "keydown">;
            };
        };
    };
    events: CloseEvents;
};
export type DateRangePickerCloseProps = typeof __propDef.props;
export type DateRangePickerCloseEvents = typeof __propDef.events;
export type DateRangePickerCloseSlots = typeof __propDef.slots;
export default class DateRangePickerClose extends SvelteComponent<DateRangePickerCloseProps, DateRangePickerCloseEvents, DateRangePickerCloseSlots> {
}
export {};
