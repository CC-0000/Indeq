import { SvelteComponent } from "svelte";
import type { RadioGroupProps } from "../index.js";
declare const __propDef: {
    props: RadioGroupProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type MenuRadioGroupProps = typeof __propDef.props;
export type MenuRadioGroupEvents = typeof __propDef.events;
export type MenuRadioGroupSlots = typeof __propDef.slots;
export default class MenuRadioGroup extends SvelteComponent<MenuRadioGroupProps, MenuRadioGroupEvents, MenuRadioGroupSlots> {
}
export {};
