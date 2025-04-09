import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        disabled?: boolean | undefined;
        isDateUnavailable?: import("@melt-ui/svelte/index.js").Matcher | undefined;
        minValue?: import("@internationalized/date").DateValue | undefined;
        maxValue?: import("@internationalized/date").DateValue | undefined;
        readonly?: boolean | undefined;
        locale?: string | undefined;
        readonlySegments?: {
            start: import("@melt-ui/svelte/index.js").EditableSegmentPart[];
            end: import("@melt-ui/svelte/index.js").EditableSegmentPart[];
        } | undefined;
        hourCycle?: (12 | 24) | undefined;
        granularity?: import("@melt-ui/svelte/index.js").Granularity | undefined;
        hideTimeZone?: boolean | undefined;
        value?: import("../../../index.js").DateRange | undefined;
        onValueChange?: import("../../../internal/types.js").OnChangeFn<import("../../../index.js").DateRange | undefined> | undefined;
        placeholder?: import("@internationalized/date").DateValue | undefined;
        onPlaceholderChange?: import("../../../internal/types.js").OnChangeFn<import("@internationalized/date").DateValue> | undefined;
        validationId?: string | undefined;
        descriptionId?: string | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            isInvalid: boolean;
            ids: {
                start: {
                    day: string;
                    description: string;
                    dayPeriod: string;
                    hour: string;
                    minute: string;
                    month: string;
                    second: string;
                    year: string;
                    validation: string;
                    label: string;
                    timeZoneName: string;
                };
                end: {
                    day: string;
                    description: string;
                    dayPeriod: string;
                    hour: string;
                    minute: string;
                    month: string;
                    second: string;
                    year: string;
                    validation: string;
                    label: string;
                    timeZoneName: string;
                };
                field: {
                    description: string;
                    field: string;
                    label: string;
                    validation: string;
                };
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangeFieldProps = typeof __propDef.props;
export type DateRangeFieldEvents = typeof __propDef.events;
export type DateRangeFieldSlots = typeof __propDef.slots;
export default class DateRangeField extends SvelteComponent<DateRangeFieldProps, DateRangeFieldEvents, DateRangeFieldSlots> {
}
export {};
