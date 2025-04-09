import { SvelteComponent } from "svelte";
import type { HeaderProps } from "../index.js";
declare const __propDef: {
    props: HeaderProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: Record<string, string> | undefined;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DatePickerHeaderProps = typeof __propDef.props;
export type DatePickerHeaderEvents = typeof __propDef.events;
export type DatePickerHeaderSlots = typeof __propDef.slots;
export default class DatePickerHeader extends SvelteComponent<DatePickerHeaderProps, DatePickerHeaderEvents, DatePickerHeaderSlots> {
}
export {};
