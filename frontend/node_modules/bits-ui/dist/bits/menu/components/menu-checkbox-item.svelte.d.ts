import { SvelteComponent } from "svelte";
import type { CheckboxItemEvents, CheckboxItemProps } from "../index.js";
declare const __propDef: {
    props: CheckboxItemProps;
    slots: {
        default: {
            builder: {
                readonly role: "menuitemcheckbox";
                readonly tabindex: -1;
                readonly 'data-orientation': "vertical";
                readonly 'aria-checked': "true" | "mixed" | "false";
                readonly 'data-disabled': true | undefined;
                readonly 'data-state': "indeterminate" | "checked" | "unchecked";
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">;
            };
        };
    };
    events: CheckboxItemEvents;
};
export type MenuCheckboxItemProps = typeof __propDef.props;
export type MenuCheckboxItemEvents = typeof __propDef.events;
export type MenuCheckboxItemSlots = typeof __propDef.slots;
export default class MenuCheckboxItem extends SvelteComponent<MenuCheckboxItemProps, MenuCheckboxItemEvents, MenuCheckboxItemSlots> {
}
export {};
