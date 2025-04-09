import { SvelteComponent } from "svelte";
import type { ArrowProps } from "../index.js";
declare const __propDef: {
    props: ArrowProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                'data-arrow': boolean;
                style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DatePickerArrowProps = typeof __propDef.props;
export type DatePickerArrowEvents = typeof __propDef.events;
export type DatePickerArrowSlots = typeof __propDef.slots;
export default class DatePickerArrow extends SvelteComponent<DatePickerArrowProps, DatePickerArrowEvents, DatePickerArrowSlots> {
}
export {};
