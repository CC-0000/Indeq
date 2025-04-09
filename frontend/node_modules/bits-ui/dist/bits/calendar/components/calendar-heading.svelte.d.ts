import { SvelteComponent } from "svelte";
import type { HeadingProps } from "../index.js";
declare const __propDef: {
    props: HeadingProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                'aria-hidden': boolean;
                'data-disabled': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
            headingValue: string;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type CalendarHeadingProps = typeof __propDef.props;
export type CalendarHeadingEvents = typeof __propDef.events;
export type CalendarHeadingSlots = typeof __propDef.slots;
export default class CalendarHeading extends SvelteComponent<CalendarHeadingProps, CalendarHeadingEvents, CalendarHeadingSlots> {
}
export {};
