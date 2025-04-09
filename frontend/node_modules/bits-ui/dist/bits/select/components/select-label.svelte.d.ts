import { SvelteComponent } from "svelte";
import type { LabelEvents, LabelProps } from "../index.js";
declare const __propDef: {
    props: LabelProps;
    slots: {
        default: {
            builder: {
                id: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    events: LabelEvents;
};
export type SelectLabelProps = typeof __propDef.props;
export type SelectLabelEvents = typeof __propDef.events;
export type SelectLabelSlots = typeof __propDef.slots;
export default class SelectLabel extends SvelteComponent<SelectLabelProps, SelectLabelEvents, SelectLabelSlots> {
}
export {};
