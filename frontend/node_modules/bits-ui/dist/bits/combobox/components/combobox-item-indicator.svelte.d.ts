import { SvelteComponent } from "svelte";
import type { IndicatorProps } from "../index.js";
declare const __propDef: {
    props: IndicatorProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: Record<string, string> | undefined;
            isSelected: boolean;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ComboboxItemIndicatorProps = typeof __propDef.props;
export type ComboboxItemIndicatorEvents = typeof __propDef.events;
export type ComboboxItemIndicatorSlots = typeof __propDef.slots;
export default class ComboboxItemIndicator extends SvelteComponent<ComboboxItemIndicatorProps, ComboboxItemIndicatorEvents, ComboboxItemIndicatorSlots> {
}
export {};
