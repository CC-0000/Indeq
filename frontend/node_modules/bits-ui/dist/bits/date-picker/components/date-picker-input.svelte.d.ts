import { SvelteComponent } from "svelte";
import type { InputProps } from "../index.js";
declare const __propDef: {
    props: InputProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            segments: {
                part: import("@melt-ui/svelte/index.js").SegmentPart;
                value: string;
            }[];
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DatePickerInputProps = typeof __propDef.props;
export type DatePickerInputEvents = typeof __propDef.events;
export type DatePickerInputSlots = typeof __propDef.slots;
export default class DatePickerInput extends SvelteComponent<DatePickerInputProps, DatePickerInputEvents, DatePickerInputSlots> {
}
export {};
