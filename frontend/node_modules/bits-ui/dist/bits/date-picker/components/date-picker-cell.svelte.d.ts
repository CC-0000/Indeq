import { SvelteComponent } from "svelte";
import type { CellProps } from "../index.js";
declare const __propDef: {
    props: CellProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            attrs: {
                "aria-disabled": boolean | undefined;
                "data-disabled": string | undefined;
                role: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DatePickerCellProps = typeof __propDef.props;
export type DatePickerCellEvents = typeof __propDef.events;
export type DatePickerCellSlots = typeof __propDef.slots;
export default class DatePickerCell extends SvelteComponent<DatePickerCellProps, DatePickerCellEvents, DatePickerCellSlots> {
}
export {};
