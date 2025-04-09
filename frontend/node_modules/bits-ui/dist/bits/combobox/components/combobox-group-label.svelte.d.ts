import { SvelteComponent } from "svelte";
import type { GroupLabelEvents, GroupLabelProps } from "../index.js";
declare const __propDef: {
    props: GroupLabelProps;
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
    events: GroupLabelEvents;
};
export type ComboboxGroupLabelProps = typeof __propDef.props;
export type ComboboxGroupLabelEvents = typeof __propDef.events;
export type ComboboxGroupLabelSlots = typeof __propDef.slots;
export default class ComboboxGroupLabel extends SvelteComponent<ComboboxGroupLabelProps, ComboboxGroupLabelEvents, ComboboxGroupLabelSlots> {
}
export {};
