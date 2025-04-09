import { SvelteComponent } from "svelte";
import type { LinkEvents, LinkProps } from "../index.js";
declare const __propDef: {
    props: LinkProps;
    slots: {
        default: {
            builder: {
                readonly role: "link";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/toolbar/events.js").ToolbarEvents["link"]>;
            };
        };
    };
    events: LinkEvents;
};
export type ToolbarLinkProps = typeof __propDef.props;
export type ToolbarLinkEvents = typeof __propDef.events;
export type ToolbarLinkSlots = typeof __propDef.slots;
export default class ToolbarLink extends SvelteComponent<ToolbarLinkProps, ToolbarLinkEvents, ToolbarLinkSlots> {
}
export {};
