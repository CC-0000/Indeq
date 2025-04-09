import { SvelteComponent } from "svelte";
import type { RangeProps } from "../index.js";
declare const __propDef: {
    props: RangeProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
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
export type SliderRangeProps = typeof __propDef.props;
export type SliderRangeEvents = typeof __propDef.events;
export type SliderRangeSlots = typeof __propDef.slots;
export default class SliderRange extends SvelteComponent<SliderRangeProps, SliderRangeEvents, SliderRangeSlots> {
}
export {};
