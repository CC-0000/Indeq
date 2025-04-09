import { SvelteComponent } from "svelte";
import type { IndicatorProps } from "../index.js";
declare const __propDef: {
    props: IndicatorProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: {
                "data-state": string;
            };
            isChecked: boolean;
            isIndeterminate: boolean;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type CheckboxIndicatorProps = typeof __propDef.props;
export type CheckboxIndicatorEvents = typeof __propDef.events;
export type CheckboxIndicatorSlots = typeof __propDef.slots;
export default class CheckboxIndicator extends SvelteComponent<CheckboxIndicatorProps, CheckboxIndicatorEvents, CheckboxIndicatorSlots> {
}
export {};
