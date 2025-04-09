import { SvelteComponent } from "svelte";
import type { InputEvents, InputProps } from "../index.js";
declare const __propDef: {
    props: InputProps;
    slots: {
        default: {
            builder: {
                readonly role: "combobox";
                readonly value: string;
                readonly autocomplete: "off";
                readonly disabled: true | undefined;
                readonly type: "button" | undefined;
                readonly 'aria-expanded': boolean;
                readonly 'aria-controls': string;
                readonly 'aria-activedescendant': string | undefined;
                readonly 'aria-autocomplete': "list";
                readonly 'aria-labelledby': string;
                readonly id: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/combobox/events.js").ComboboxEvents["input"]>;
            };
            placeholder: string | null | undefined;
        };
    };
    events: InputEvents;
};
export type ComboboxInputProps = typeof __propDef.props;
export type ComboboxInputEvents = typeof __propDef.events;
export type ComboboxInputSlots = typeof __propDef.slots;
export default class ComboboxInput extends SvelteComponent<ComboboxInputProps, ComboboxInputEvents, ComboboxInputSlots> {
}
export {};
