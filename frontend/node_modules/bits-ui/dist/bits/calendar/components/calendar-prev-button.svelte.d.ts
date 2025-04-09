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
                'data-disabled': string | undefined;
                disabled: boolean | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/calendar/events.js").CalendarEvents["prevButton"]>;
            };
        };
    };
    events: {
        click: import("../../../index.js").CustomEventHandler<MouseEvent, HTMLButtonElement>;
    };
};
export type CalendarPrevButtonProps = typeof __propDef.props;
export type CalendarPrevButtonEvents = typeof __propDef.events;
export type CalendarPrevButtonSlots = typeof __propDef.slots;
export default class CalendarPrevButton extends SvelteComponent<CalendarPrevButtonProps, CalendarPrevButtonEvents, CalendarPrevButtonSlots> {
}
export {};
