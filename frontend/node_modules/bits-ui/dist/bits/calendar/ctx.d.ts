import { type CreateCalendarProps } from "@melt-ui/svelte";
export declare function getCalendarData(): {
    NAME: "calendar";
    PARTS: readonly ["root", "prev-button", "next-button", "heading", "grid", "day", "header", "grid-head", "head-cell", "grid-body", "cell", "grid-row"];
};
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx<Multiple extends boolean>(props: CreateCalendarProps<Multiple>): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getCalendarAttrs: (part: "header" | "root" | "cell" | "grid" | "heading" | "prev-button" | "next-button" | "day" | "grid-head" | "head-cell" | "grid-body" | "grid-row") => Record<string, string> | undefined;
    elements: {
        calendar: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/calendar/events").CalendarEvents["calendar"]>, ([$fullCalendarLabel, $isInvalid, $disabled, $readonly, $calendarId]: [string, boolean, boolean, boolean, string]) => {
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
        cell: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Matcher | undefined>>, import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>, {
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
        }], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/calendar/events").CalendarEvents["cell"]>, ([$isDateSelected, $isDateDisabled, $isDateUnavailable, $isOutsideVisibleMonths, $placeholder,]: [(date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, import("@melt-ui/svelte").Matcher | undefined, (date: import("@internationalized/date").DateValue) => boolean, import("@internationalized/date").DateValue]) => (cellValue: import("@internationalized/date").DateValue, monthValue: import("@internationalized/date").DateValue) => {
            readonly role: "button";
            readonly "aria-label": string;
            readonly "aria-selected": true | undefined;
            readonly "aria-disabled": true | undefined;
            readonly "data-selected": true | undefined;
            readonly "data-value": string;
            readonly "data-disabled": "" | undefined;
            readonly "data-unavailable": "" | undefined;
            readonly "data-today": "" | undefined;
            readonly "data-outside-month": "" | undefined;
            readonly "data-outside-visible-months": "" | undefined;
            readonly "data-focused": "" | undefined;
            readonly tabindex: 0 | -1 | undefined;
        }, string>;
        nextButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/calendar/events").CalendarEvents["nextButton"]>, ([$isNextButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            "data-disabled": string | undefined;
            disabled: boolean | undefined;
        }, string>;
        prevButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/calendar/events").CalendarEvents["prevButton"]>, ([$isPrevButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            "data-disabled": string | undefined;
            disabled: boolean | undefined;
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
        value: {
            update: (updater: import("svelte/store").Updater<import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined>, sideEffect?: ((newValue: import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined) => void) | undefined) => void;
            set: (this: void, value: import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined>, invalidate?: import("svelte/store").Invalidator<import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined;
            destroy?: (() => void) | undefined;
        };
        weekdays: import("svelte/store").Readable<string[]>;
        headingValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>;
    };
    helpers: {
        nextPage: () => void;
        prevPage: () => void;
        nextYear: () => void;
        prevYear: () => void;
        setYear: (year: number) => void;
        setMonth: (month: number) => void;
        isDateDisabled: import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>;
        isDateSelected: import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>;
        isDateUnavailable: import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean | undefined>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        multiple: Multiple;
        disabled: boolean;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined> | undefined;
        defaultValue?: import("@melt-ui/svelte/internal/types").WhenTrue<Multiple, import("@internationalized/date").DateValue[], import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | import("@internationalized/date").DateValue[]> | undefined;
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
