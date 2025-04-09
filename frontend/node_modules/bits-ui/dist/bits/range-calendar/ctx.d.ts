import { type CreateRangeCalendarProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateRangeCalendarProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "header" | "root" | "cell" | "grid" | "heading" | "prev-button" | "next-button" | "day" | "grid-head" | "head-cell" | "grid-body" | "grid-row") => Record<string, string> | undefined;
    elements: {
        calendar: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/range-calendar/events").RangeCalendarEvents["calendar"]>, ([$fullCalendarLabel, $isInvalid, $calendarId, $disabled, $readonly]: [string, boolean, string, boolean, boolean]) => {
            id: string;
            role: string;
            "aria-label": string;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
            "data-readonly": string | undefined;
        }, string>;
        heading: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$disabled]: [boolean]) => {
            "aria-hidden": boolean;
            "data-disabled": string | undefined;
        }, string>;
        grid: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$readonly, $disabled]: [boolean, boolean]) => {
            tabindex: number;
            role: string;
            "aria-readonly": "true" | undefined;
            "aria-disabled": "true" | undefined;
            "data-readonly": string | undefined;
            "data-disabled": string | undefined;
        }, string>;
        cell: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>, import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>, import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<{
            start: import("@internationalized/date").DateValue;
            end: import("@internationalized/date").DateValue;
        } | null>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>>, {
            get: () => import("@internationalized/date").DateValue;
            set: (this: void, value: import("@internationalized/date").DateValue) => void;
            update: (this: void, updater: import("svelte/store").Updater<import("@internationalized/date").DateValue>) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue> | undefined) => import("svelte/store").Unsubscriber;
            add: (duration: import("@internationalized/date").DateTimeDuration | import("@internationalized/date").DateDuration) => void;
            subtract: (duration: import("@internationalized/date").DateTimeDuration | import("@internationalized/date").DateDuration) => void;
            setDate: (fields: import("@internationalized/date").DateFields | (import("@internationalized/date").DateFields & import("@internationalized/date").TimeFields), disambiguation?: import("@internationalized/date").Disambiguation | undefined) => void;
            reset: () => void;
            toWritable: () => {
                set: (this: void, value: import("@internationalized/date").DateValue) => void;
                subscribe: (this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue> | undefined) => import("svelte/store").Unsubscriber;
                update: (this: void, updater: import("svelte/store").Updater<import("@internationalized/date").DateValue>) => void;
                get: () => import("@internationalized/date").DateValue;
            };
            nextPage: (amount: number) => void;
            prevPage: (amount: number) => void;
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/range-calendar/events").RangeCalendarEvents["cell"]>, ([$isSelected, $isSelectionEnd, $isSelectionStart, $highlightedRange, $isDateDisabled, $isDateUnavailable, $placeholder, $isOutsideVisibleMonths,]: [(date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, {
            start: import("@internationalized/date").DateValue;
            end: import("@internationalized/date").DateValue;
        } | null, (date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, import("@internationalized/date").DateValue, (date: import("@internationalized/date").DateValue) => boolean]) => (cellValue: import("@internationalized/date").DateValue, monthValue: import("@internationalized/date").DateValue) => {
            readonly role: "button";
            readonly "aria-label": string;
            readonly "aria-selected": true | undefined;
            readonly "aria-disabled": true | undefined;
            readonly "data-selected": true | undefined;
            readonly "data-selection-start": true | undefined;
            readonly "data-selection-end": true | undefined;
            readonly "data-value": string;
            readonly "data-disabled": "" | undefined;
            readonly "data-unavailable": "" | undefined;
            readonly "data-today": "" | undefined;
            readonly "data-outside-month": "" | undefined;
            readonly "data-outside-visible-months": "" | undefined;
            readonly "data-focused": "" | undefined;
            readonly "data-highlighted": "" | undefined;
            readonly tabindex: 0 | -1 | undefined;
        }, string>;
        nextButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/range-calendar/events").RangeCalendarEvents["nextButton"]>, ([$isNextButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            disabled: boolean | undefined;
            "data-disabled": string | undefined;
        }, string>;
        prevButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/range-calendar/events").RangeCalendarEvents["prevButton"]>, ([$isPrevButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            disabled: boolean | undefined;
            "data-disabled": string | undefined;
        }, string>;
    };
    states: {
        placeholder: {
            set: (this: void, value: import("@internationalized/date").DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<import("@internationalized/date").DateValue>) => void;
            get: () => import("@internationalized/date").DateValue;
        };
        months: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Month<import("@internationalized/date").DateValue>[]>>;
        weekdays: import("svelte/store").Readable<string[]>;
        headingValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>;
        value: {
            update: (updater: import("svelte/store").Updater<import("@melt-ui/svelte").DateRange>, sideEffect?: ((newValue: import("@melt-ui/svelte").DateRange) => void) | undefined) => void;
            set: (this: void, value: import("@melt-ui/svelte").DateRange) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@melt-ui/svelte").DateRange>, invalidate?: import("svelte/store").Invalidator<import("@melt-ui/svelte").DateRange> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@melt-ui/svelte").DateRange;
            destroy?: (() => void) | undefined;
        };
        startValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        endValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
    };
    helpers: {
        nextPage: () => void;
        prevPage: () => void;
        nextYear: () => void;
        prevYear: () => void;
        setYear: (year: number) => void;
        setMonth: (month: number) => void;
        isDateDisabled: import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>;
        isDateUnavailable: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        disabled: boolean;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@melt-ui/svelte").DateRange> | undefined;
        defaultValue: import("@melt-ui/svelte").DateRange;
        ids?: Partial<{
            calendar: string;
            accessibleHeading: string;
        }> | undefined;
        defaultPlaceholder?: import("@internationalized/date").DateValue | undefined;
        onPlaceholderChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@internationalized/date").DateValue> | undefined;
        isDateUnavailable: import("@melt-ui/svelte").Matcher | undefined;
        minValue: import("@internationalized/date").DateValue | undefined;
        maxValue: import("@internationalized/date").DateValue | undefined;
        readonly: boolean;
        locale: string;
        weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        fixedWeeks: boolean;
        numberOfMonths: number;
        preventDeselect: boolean;
        pagedNavigation: boolean;
        weekdayFormat: "long" | "short" | "narrow";
        isDateDisabled: import("@melt-ui/svelte").Matcher | undefined;
        calendarLabel: string;
    }>;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        calendar: string;
        accessibleHeading: string;
    }>;
};
export declare function getCtx(): GetReturn;
export {};
