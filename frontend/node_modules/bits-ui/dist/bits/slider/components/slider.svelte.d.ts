import { SvelteComponent } from "svelte";
import type { Props } from "../index.js";
declare const __propDef: {
    props: Props;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                dir: "ltr" | "rtl";
                disabled: boolean | undefined;
                'data-disabled': boolean | undefined;
                'data-orientation': import("@melt-ui/svelte/index.js").SliderOrientation;
                style: string | undefined;
                'data-melt-id': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
            ticks: ({
                'data-bounded': boolean | undefined;
                'data-value': number;
                style: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            })[];
            thumbs: [{
                readonly role: "slider";
                readonly 'aria-valuemin': number;
                readonly 'aria-valuemax': number;
                readonly 'aria-valuenow': number;
                readonly 'aria-disabled': true | undefined;
                readonly 'aria-orientation': import("@melt-ui/svelte/index.js").SliderOrientation;
                readonly 'data-melt-part': "thumb";
                readonly 'data-value': number;
                readonly style: string;
                readonly tabindex: 0 | -1;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/slider/events.js").SliderEvents["thumb"]>;
            }, ...({
                readonly role: "slider";
                readonly 'aria-valuemin': number;
                readonly 'aria-valuemax': number;
                readonly 'aria-valuenow': number;
                readonly 'aria-disabled': true | undefined;
                readonly 'aria-orientation': import("@melt-ui/svelte/index.js").SliderOrientation;
                readonly 'data-melt-part': "thumb";
                readonly 'data-value': number;
                readonly style: string;
                readonly tabindex: 0 | -1;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/slider/events.js").SliderEvents["thumb"]>;
            })[]];
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type SliderProps = typeof __propDef.props;
export type SliderEvents = typeof __propDef.events;
export type SliderSlots = typeof __propDef.slots;
export default class Slider extends SvelteComponent<SliderProps, SliderEvents, SliderSlots> {
}
export {};
