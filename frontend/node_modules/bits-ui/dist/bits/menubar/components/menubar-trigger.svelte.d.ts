import { SvelteComponent } from "svelte";
import type { TriggerEvents, TriggerProps } from "../index.js";
declare const __propDef: {
    props: TriggerProps;
    slots: {
        default: {
            builder: {
                readonly 'aria-controls': string;
                readonly 'aria-expanded': boolean;
                readonly 'data-state': "open" | "closed";
                readonly id: string;
                readonly 'aria-haspopup': "menu";
                readonly 'data-orientation': "horizontal";
                readonly role: "menuitem";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/menubar/events.js").MenubarEvents["trigger"]>;
            };
        };
    };
    events: TriggerEvents;
};
export type MenubarTriggerProps = typeof __propDef.props;
export type MenubarTriggerEvents = typeof __propDef.events;
export type MenubarTriggerSlots = typeof __propDef.slots;
export default class MenubarTrigger extends SvelteComponent<MenubarTriggerProps, MenubarTriggerEvents, MenubarTriggerSlots> {
}
export {};
