import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        disabled?: boolean | undefined;
        portal?: string | HTMLElement | null | undefined;
        preventScroll?: boolean | undefined;
        closeOnEscape?: boolean | undefined;
        closeOnOutsideClick?: boolean | undefined;
        onOutsideClick?: ((event: import("@melt-ui/svelte/index.js").InteractOutsideEvent) => void) | undefined;
        openFocus?: import("@melt-ui/svelte/index.js").FocusProp | undefined;
        closeFocus?: import("@melt-ui/svelte/index.js").FocusProp | undefined;
        isDateUnavailable?: import("@melt-ui/svelte/index.js").Matcher | undefined;
        minValue?: import("@internationalized/date").DateValue | undefined;
        maxValue?: import("@internationalized/date").DateValue | undefined;
        readonly?: boolean | undefined;
        locale?: string | undefined;
        weekStartsOn?: 0 | 1 | 2 | 3 | 5 | 4 | 6 | undefined;
        fixedWeeks?: boolean | undefined;
        numberOfMonths?: number | undefined;
        preventDeselect?: boolean | undefined;
        pagedNavigation?: boolean | undefined;
        weekdayFormat?: "long" | "short" | "narrow" | undefined;
        isDateDisabled?: import("@melt-ui/svelte/index.js").Matcher | undefined;
        calendarLabel?: string | undefined;
        hourCycle?: 12 | 24 | undefined;
        granularity?: import("@melt-ui/svelte/index.js").Granularity | undefined;
        hideTimeZone?: boolean | undefined;
        disableFocusTrap?: boolean | undefined;
        open?: boolean | undefined;
        onOpenChange?: import("../../../internal/types.js").OnChangeFn<boolean> | undefined;
        value?: import("../../../index.js").DateRange | undefined;
        onValueChange?: import("../../../internal/types.js").OnChangeFn<import("../../../index.js").DateRange | undefined> | undefined;
        placeholder?: import("@internationalized/date").DateValue | undefined;
        onPlaceholderChange?: import("../../../internal/types.js").OnChangeFn<import("@internationalized/date").DateValue> | undefined;
        validationId?: string | undefined;
        descriptionId?: string | undefined;
        startValue?: import("@internationalized/date").DateValue | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            isInvalid: boolean;
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateRangePickerFieldProps = typeof __propDef.props;
export type DateRangePickerFieldEvents = typeof __propDef.events;
export type DateRangePickerFieldSlots = typeof __propDef.slots;
export default class DateRangePickerField extends SvelteComponent<DateRangePickerFieldProps, DateRangePickerFieldEvents, DateRangePickerFieldSlots> {
}
export {};
