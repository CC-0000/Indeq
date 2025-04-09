import { SvelteComponent } from "svelte";
import type { Events, Props } from "../index.js";
declare const __propDef: {
    props: Props;
    slots: {
        default: {
            builder: {
                readonly 'data-disabled': true | undefined;
                readonly disabled: true | undefined;
                readonly 'data-state': "indeterminate" | "checked" | "unchecked";
                readonly type: "button";
                readonly role: "checkbox";
                readonly 'aria-checked': boolean | "mixed";
                readonly 'aria-required': boolean;
            } & {
                "data-melt-checkbox": "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/checkbox/events.js").CheckboxEvents["root"]>;
            };
        };
    };
    events: Events;
};
export type CheckboxProps = typeof __propDef.props;
export type CheckboxEvents = typeof __propDef.events;
export type CheckboxSlots = typeof __propDef.slots;
export default class Checkbox extends SvelteComponent<CheckboxProps, CheckboxEvents, CheckboxSlots> {
}
export {};
