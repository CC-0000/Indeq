import { SvelteComponent } from "svelte";
import type { RadioIndicatorProps } from "../index.js";
declare const __propDef: {
    props: RadioIndicatorProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: Record<string, string> | undefined;
            checked: boolean;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type MenuRadioIndicatorProps = typeof __propDef.props;
export type MenuRadioIndicatorEvents = typeof __propDef.events;
export type MenuRadioIndicatorSlots = typeof __propDef.slots;
export default class MenuRadioIndicator extends SvelteComponent<MenuRadioIndicatorProps, MenuRadioIndicatorEvents, MenuRadioIndicatorSlots> {
}
export {};
