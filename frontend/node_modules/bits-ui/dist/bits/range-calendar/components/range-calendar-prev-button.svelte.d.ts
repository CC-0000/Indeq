import { SvelteComponent } from "svelte";
import type { PrevButtonProps } from "../index.js";
declare const __propDef: {
    props: PrevButtonProps;
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
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/range-calendar/events.js").RangeCalendarEvents["prevButton"]>;
            };
        };
    };
    events: {
        click: import("../../../index.js").CustomEventHandler<MouseEvent, HTMLButtonElement>;
    };
};
export type RangeCalendarPrevButtonProps = typeof __propDef.props;
export type RangeCalendarPrevButtonEvents = typeof __propDef.events;
export type RangeCalendarPrevButtonSlots = typeof __propDef.slots;
export default class RangeCalendarPrevButton extends SvelteComponent<RangeCalendarPrevButtonProps, RangeCalendarPrevButtonEvents, RangeCalendarPrevButtonSlots> {
}
export {};
