import { SvelteComponent } from "svelte";
import type { RadioItemEvents, RadioItemProps } from "../index.js";
declare const __propDef: {
    props: RadioItemProps;
    slots: {
        default: {
            builder: {
                disabled: boolean;
                role: string;
                'data-state': string;
                'aria-checked': boolean;
                'data-disabled': boolean | undefined;
                'data-value': string;
                'data-orientation': string;
                tabindex: number;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">;
            };
        };
    };
    events: RadioItemEvents;
};
export type MenuRadioItemProps = typeof __propDef.props;
export type MenuRadioItemEvents = typeof __propDef.events;
export type MenuRadioItemSlots = typeof __propDef.slots;
export default class MenuRadioItem extends SvelteComponent<MenuRadioItemProps, MenuRadioItemEvents, MenuRadioItemSlots> {
}
export {};
