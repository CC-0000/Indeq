import { SvelteComponent } from "svelte";
import type { InputProps } from "../index.js";
declare const __propDef: {
    props: InputProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
                id: string;
                'aria-labelledby': string;
                'aria-describedby': string;
                'data-invalid': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: <Node_3 extends unknown>() => {
                    destroy(): void;
                };
            };
            segments: {
                start: {
                    part: import("@melt-ui/svelte/index.js").SegmentPart;
                    value: string;
                }[];
                end: {
                    part: import("@melt-ui/svelte/index.js").SegmentPart;
                    value: string;
                }[];
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerInputProps = typeof __propDef.props;
export type DateRangePickerInputEvents = typeof __propDef.events;
export type DateRangePickerInputSlots = typeof __propDef.slots;
export default class DateRangePickerInput extends SvelteComponent<DateRangePickerInputProps, DateRangePickerInputEvents, DateRangePickerInputSlots> {
}
export {};
