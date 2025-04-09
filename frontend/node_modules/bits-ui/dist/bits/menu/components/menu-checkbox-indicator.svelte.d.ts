import { SvelteComponent } from "svelte";
import type { CheckboxIndicatorProps } from "../index.js";
declare const __propDef: {
    props: CheckboxIndicatorProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: Record<string, string> | undefined;
            checked: boolean | "indeterminate";
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type MenuCheckboxIndicatorProps = typeof __propDef.props;
export type MenuCheckboxIndicatorEvents = typeof __propDef.events;
export type MenuCheckboxIndicatorSlots = typeof __propDef.slots;
export default class MenuCheckboxIndicator extends SvelteComponent<MenuCheckboxIndicatorProps, MenuCheckboxIndicatorEvents, MenuCheckboxIndicatorSlots> {
}
export {};
