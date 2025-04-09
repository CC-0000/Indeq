/// <reference types="svelte" />
import { type Month } from '../../internal/helpers/date/index.js';
import type { MeltActionReturn } from '../../internal/types.js';
import { type DateValue } from '@internationalized/date';
import type { CalendarEvents } from './events.js';
import type { CalendarValue, CreateCalendarProps } from './types.js';
export declare const defaults: {
    isDateDisabled: undefined;
    isDateUnavailable: undefined;
    value: undefined;
    preventDeselect: false;
    numberOfMonths: number;
    pagedNavigation: false;
    weekStartsOn: 0;
    fixedWeeks: false;
    calendarLabel: string;
    locale: string;
    minValue: undefined;
    maxValue: undefined;
    disabled: false;
    readonly: false;
    weekdayFormat: "narrow";
};
export declare const calendarIdParts: readonly ["calendar", "accessibleHeading"];
export type CalendarIdParts = typeof calendarIdParts;
export declare function createCalendar<Multiple extends boolean = false, Value extends DateValue = DateValue, S extends CalendarValue<Multiple, Value> = CalendarValue<Multiple, Value>>(props?: CreateCalendarProps<Multiple, Value, S>): {
    elements: {
        calendar: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<CalendarEvents['calendar']>, ([$fullCalendarLabel, $isInvalid, $disabled, $readonly, $calendarId]: [string, boolean, boolean, boolean, string]) => {
            id: string;
            role: string;
            'aria-label': string;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
            'data-readonly': string | undefined;
        }, string>;
        heading: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$disabled]: [boolean]) => {
            'aria-hidden': boolean;
            'data-disabled': string | undefined;
        }, string>;
        grid: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$readonly, $disabled]: [boolean, boolean]) => {
            tabindex: number;
            role: string;
            'aria-readonly': "true" | undefined;
            'aria-disabled': "true" | undefined;
            'data-readonly': string | undefined;
            'data-disabled': string | undefined;
        }, string>;
        cell: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<(date: DateValue) => boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<(date: DateValue) => boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("../../internal/helpers/date/index.js").Matcher | undefined>>, import("svelte/store").Readable<(date: DateValue) => boolean>, {
            get: () => DateValue;
            set: (this: void, value: DateValue) => void;
            update: (this: void, updater: import("svelte/store").Updater<DateValue>) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
            add: (duration: import("@internationalized/date").DateTimeDuration | import("@internationalized/date").DateDuration) => void;
            subtract: (duration: import("@internationalized/date").DateTimeDuration | import("@internationalized/date").DateDuration) => void;
            setDate: (fields: import("@internationalized/date").DateFields | (import("@internationalized/date").DateFields & import("@internationalized/date").TimeFields), disambiguation?: import("@internationalized/date").Disambiguation | undefined) => void;
            reset: () => void;
            toWritable: () => {
                set: (this: void, value: DateValue) => void;
                subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
                update: (this: void, updater: import("svelte/store").Updater<DateValue>) => void;
                get: () => DateValue;
            };
            nextPage: (amount: number) => void;
            prevPage: (amount: number) => void;
        }], (node: HTMLElement) => MeltActionReturn<CalendarEvents['cell']>, ([$isDateSelected, $isDateDisabled, $isDateUnavailable, $isOutsideVisibleMonths, $placeholder,]: [(date: DateValue) => boolean, (date: DateValue) => boolean, import("../../internal/helpers/date/index.js").Matcher | undefined, (date: DateValue) => boolean, DateValue]) => (cellValue: DateValue, monthValue: DateValue) => {
            readonly role: "button";
            readonly 'aria-label': string;
            readonly 'aria-selected': true | undefined;
            readonly 'aria-disabled': true | undefined;
            readonly 'data-selected': true | undefined;
            readonly 'data-value': string;
            readonly 'data-disabled': "" | undefined;
            readonly 'data-unavailable': "" | undefined;
            readonly 'data-today': "" | undefined;
            readonly 'data-outside-month': "" | undefined;
            readonly 'data-outside-visible-months': "" | undefined;
            readonly 'data-focused': "" | undefined;
            readonly tabindex: 0 | -1 | undefined;
        }, string>;
        nextButton: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => MeltActionReturn<CalendarEvents['nextButton']>, ([$isNextButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            'aria-label': string;
            'aria-disabled': "true" | undefined;
            'data-disabled': string | undefined;
            disabled: boolean | undefined;
        }, string>;
        prevButton: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => MeltActionReturn<CalendarEvents['prevButton']>, ([$isPrevButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            'aria-label': string;
            'aria-disabled': "true" | undefined;
            'data-disabled': string | undefined;
            disabled: boolean | undefined;
        }, string>;
    };
    states: {
        placeholder: {
            set: (this: void, value: DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<DateValue>) => void;
            get: () => DateValue;
        };
        months: import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<Month<DateValue>[]>>;
        value: {
            update: (updater: import("svelte/store").Updater<S | undefined>, sideEffect?: ((newValue: S | undefined) => void) | undefined) => void;
            set: (this: void, value: S | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<S | undefined>, invalidate?: import("svelte/store").Invalidator<S | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => S | undefined;
            destroy?: (() => void) | undefined;
        };
        weekdays: import("svelte/store").Readable<string[]>;
        headingValue: import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<string>>;
    };
    helpers: {
        nextPage: () => void;
        prevPage: () => void;
        nextYear: () => void;
        prevYear: () => void;
        setYear: (year: number) => void;
        setMonth: (month: number) => void;
        isDateDisabled: import("svelte/store").Readable<(date: DateValue) => boolean>;
        isDateSelected: import("svelte/store").Readable<(date: DateValue) => boolean>;
        isDateUnavailable: import("svelte/store").Readable<(date: DateValue) => boolean | undefined>;
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<{
        multiple: Multiple;
        disabled: boolean;
        onValueChange?: import("../../internal/helpers/index.js").ChangeFn<S | undefined> | undefined;
        defaultValue?: S | undefined;
        defaultPlaceholder?: DateValue | undefined;
        onPlaceholderChange?: import("../../internal/helpers/index.js").ChangeFn<DateValue> | undefined;
        isDateUnavailable: import("../../internal/helpers/date/index.js").Matcher | undefined;
        minValue: DateValue | undefined;
        maxValue: DateValue | undefined;
        readonly: boolean;
        locale: string;
        weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        fixedWeeks: boolean;
        numberOfMonths: number;
        preventDeselect: boolean;
        pagedNavigation: boolean;
        weekdayFormat: "long" | "short" | "narrow";
        isDateDisabled: import("../../internal/helpers/date/index.js").Matcher | undefined;
        calendarLabel: string;
    }>;
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        calendar: string;
        accessibleHeading: string;
    }>;
};
