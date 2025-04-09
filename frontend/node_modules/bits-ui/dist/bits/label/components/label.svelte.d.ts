import { SvelteComponent } from "svelte";
import type { Events, Props } from "../index.js";
declare const __propDef: {
    props: Props;
    slots: {
        default: {
            builder: (Record<string, any> | ((...args: any[]) => Record<string, any>) | ((...args: any[]) => Record<string, any>) | ((...args: any[]) => Record<string, any>) | ((...args: any[]) => Record<string, any>)) & {
                "data-melt-label": "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/label/events.js").LabelEvents["root"]>;
            };
        };
    };
    events: Events;
};
export type LabelProps = typeof __propDef.props;
export type LabelEvents = typeof __propDef.events;
export type LabelSlots = typeof __propDef.slots;
export default class Label extends SvelteComponent<LabelProps, LabelEvents, LabelSlots> {
}
export {};
