import { SvelteComponent } from "svelte";
import type { NextButtonProps } from "../index.js";
declare const __propDef: {
    props: NextButtonProps;
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
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/range-calendar/events.js").RangeCalendarEvents["nextButton"]>;
            };
        };
    };
    events: {
        click: import("../../../index.js").CustomEventHandler<MouseEvent, HTMLButtonElement>;
    };
};
export type RangeCalendarNextButtonProps = typeof __propDef.props;
export type RangeCalendarNextButtonEvents = typeof __propDef.events;
export type RangeCalendarNextButtonSlots = typeof __propDef.slots;
export default class RangeCalendarNextButton extends SvelteComponent<RangeCalendarNextButtonProps, RangeCalendarNextButtonEvents, RangeCalendarNextButtonSlots> {
}
export {};
