import { SvelteComponent } from "svelte";
import type { ThumbEvents, ThumbProps } from "../index.js";
declare const __propDef: {
    props: ThumbProps;
    slots: {
        default: {
            builder: {
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
            };
        };
    };
    events: ThumbEvents;
};
export type SliderThumbProps = typeof __propDef.props;
export type SliderThumbEvents = typeof __propDef.events;
export type SliderThumbSlots = typeof __propDef.slots;
export default class SliderThumb extends SvelteComponent<SliderThumbProps, SliderThumbEvents, SliderThumbSlots> {
}
export {};
