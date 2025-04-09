import { SvelteComponent } from "svelte";
import type { ButtonEvents, ButtonProps } from "../index.js";
declare const __propDef: {
    props: ButtonProps;
    slots: {
        default: {
            builder: {
                readonly role: "button";
                readonly type: "button";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toolbar/events.js").ToolbarEvents["button"]>;
            };
        };
    };
    events: ButtonEvents;
};
export type ToolbarButtonProps = typeof __propDef.props;
export type ToolbarButtonEvents = typeof __propDef.events;
export type ToolbarButtonSlots = typeof __propDef.slots;
export default class ToolbarButton extends SvelteComponent<ToolbarButtonProps, ToolbarButtonEvents, ToolbarButtonSlots> {
}
export {};
