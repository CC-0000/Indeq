import { SvelteComponent } from "svelte";
import type { GroupItemEvents, GroupItemProps } from "../index.js";
declare const __propDef: {
    props: GroupItemProps;
    slots: {
        default: {
            builder: {
                readonly disabled: true | undefined;
                readonly pressed: boolean;
                readonly 'data-orientation': import("@melt-ui/svelte/internal/types").Orientation;
                readonly 'data-disabled': true | undefined;
                readonly 'data-value': string;
                readonly 'data-state': "on" | "off";
                readonly 'aria-checked': boolean | undefined;
                readonly 'aria-pressed': boolean | undefined;
                readonly type: "button";
                readonly role: "radio" | undefined;
                readonly 'data-melt-toolbar-item': "";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toolbar/events.js").ToolbarEvents["item"]>;
            };
        };
    };
    events: GroupItemEvents;
};
export type ToolbarGroupItemProps = typeof __propDef.props;
export type ToolbarGroupItemEvents = typeof __propDef.events;
export type ToolbarGroupItemSlots = typeof __propDef.slots;
export default class ToolbarGroupItem extends SvelteComponent<ToolbarGroupItemProps, ToolbarGroupItemEvents, ToolbarGroupItemSlots> {
}
export {};
