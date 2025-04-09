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
export type DatePickerHeadingProps = typeof __propDef.props;
export type DatePickerHeadingEvents = typeof __propDef.events;
export type DatePickerHeadingSlots = typeof __propDef.slots;
export default class DatePickerHeading extends SvelteComponent<DatePickerHeadingProps, DatePickerHeadingEvents, DatePickerHeadingSlots> {
}
export {};
