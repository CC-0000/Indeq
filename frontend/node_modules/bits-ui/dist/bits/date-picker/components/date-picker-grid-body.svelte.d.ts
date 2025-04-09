import { SvelteComponent } from "svelte";
import type { GridBodyProps } from "../index.js";
declare const __propDef: {
    props: GridBodyProps;
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
export type DatePickerGridBodyProps = typeof __propDef.props;
export type DatePickerGridBodyEvents = typeof __propDef.events;
export type DatePickerGridBodySlots = typeof __propDef.slots;
export default class DatePickerGridBody extends SvelteComponent<DatePickerGridBodyProps, DatePickerGridBodyEvents, DatePickerGridBodySlots> {
}
export {};
