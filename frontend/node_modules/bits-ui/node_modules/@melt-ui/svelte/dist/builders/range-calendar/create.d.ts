/// <reference types="svelte" />
import { type Month } from '../../internal/helpers/date/index.js';
import type { MeltActionReturn } from '../../internal/types.js';
import { type DateValue } from '@internationalized/date';
import type { RangeCalendarEvents } from './events.js';
import type { CreateRangeCalendarProps } from './types.js';
export declare const rangeCalendarIdParts: readonly ["calendar", "accessibleHeading"];
export type RangeCalendarIdParts = typeof rangeCalendarIdParts;
export declare function createRangeCalendar<T extends DateValue = DateValue>(props?: CreateRangeCalendarProps): {
    elements: {
        calendar: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => MeltActionReturn<RangeCalendarEvents['calendar']>, ([$fullCalendarLabel, $isInvalid, $calendarId, $disabled, $readonly]: [string, boolean, string, boolean, boolean]) => {
            id: string;
            role: string;
            'aria-label': string;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
            'data-readonly': string | undefined;
        }, string>;
        heading: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$disabled]: [boolean]) => {
            'aria-hidden': boolean;
            'data-disabled': string | undefined;
        }, string>;
        grid: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$readonly, $disabled]: [boolean, boolean]) => {
            tabindex: number;
            role: string;
            'aria-readonly': "true" | undefined;
            'aria-disabled': "true" | undefined;
            'data-readonly': string | undefined;
            'data-disabled': string | undefined;
        }, string>;
        cell: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<(date: DateValue) => boolean>, import("svelte/store").Readable<(date: DateValue) => boolean>, import("svelte/store").Readable<(date: DateValue) => boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<{
            start: DateValue;
            end: DateValue;
        } | null>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<(date: DateValue) => boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<(date: DateValue) => boolean>>, {
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
        }, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<(date: DateValue) => boolean>>], (node: HTMLElement) => MeltActionReturn<RangeCalendarEvents['cell']>, ([$isSelected, $isSelectionEnd, $isSelectionStart, $highlightedRange, $isDateDisabled, $isDateUnavailable, $placeholder, $isOutsideVisibleMonths,]: [(date: DateValue) => boolean, (date: DateValue) => boolean, (date: DateValue) => boolean, {
            start: DateValue;
            end: DateValue;
        } | null, (date: DateValue) => boolean, (date: DateValue) => boolean, DateValue, (date: DateValue) => boolean]) => (cellValue: T, monthValue: T) => {
            readonly role: "button";
            readonly 'aria-label': string;
            readonly 'aria-selected': true | undefined;
            readonly 'aria-disabled': true | undefined;
            readonly 'data-selected': true | undefined;
            readonly 'data-selection-start': true | undefined;
            readonly 'data-selection-end': true | undefined;
            readonly 'data-value': string;
            readonly 'data-disabled': "" | undefined;
            readonly 'data-unavailable': "" | undefined;
            readonly 'data-today': "" | undefined;
            readonly 'data-outside-month': "" | undefined;
            readonly 'data-outside-visible-months': "" | undefined;
            readonly 'data-focused': "" | undefined;
            readonly 'data-highlighted': "" | undefined;
            readonly tabindex: 0 | -1 | undefined;
        }, string>;
        nextButton: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => MeltActionReturn<RangeCalendarEvents['nextButton']>, ([$isNextButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            'aria-label': string;
            'aria-disabled': "true" | undefined;
            disabled: boolean | undefined;
            'data-disabled': string | undefined;
        }, string>;
        prevButton: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => MeltActionReturn<RangeCalendarEvents['prevButton']>, ([$isPrevButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            'aria-label': string;
            'aria-disabled': "true" | undefined;
            disabled: boolean | undefined;
            'data-disabled': string | undefined;
        }, string>;
    };
    states: {
        placeholder: {
            set: (this: void, value: DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<DateValue>) => void;
            get: () => DateValue;
        };
        months: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<Month<DateValue>[]>>;
        weekdays: import("svelte/store").Readable<string[]>;
        headingValue: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<string>>;
        value: {
            update: (updater: import("svelte/store").Updater<import("../../internal/helpers/date/index.js").DateRange>, sideEffect?: ((newValue: import("../../internal/helpers/date/index.js").DateRange) => void) | undefined) => void;
            set: (this: void, value: import("../../internal/helpers/date/index.js").DateRange) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("../../internal/helpers/date/index.js").DateRange>, invalidate?: import("svelte/store").Invalidator<import("../../internal/helpers/date/index.js").DateRange> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("../../internal/helpers/date/index.js").DateRange;
            destroy?: (() => void) | undefined;
        };
        startValue: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<DateValue | undefined>>;
        endValue: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<DateValue | undefined>>;
    };
    helpers: {
        nextPage: () => void;
        prevPage: () => void;
        nextYear: () => void;
        prevYear: () => void;
        setYear: (year: number) => void;
        setMonth: (month: number) => void;
        isDateDisabled: import("svelte/store").Readable<(date: DateValue) => boolean>;
        isDateUnavailable: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<(date: DateValue) => boolean>>;
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<{
        disabled: boolean;
        onValueChange?: import("../../internal/helpers/index.js").ChangeFn<import("../../internal/helpers/date/index.js").DateRange> | undefined;
        defaultValue: import("../../internal/helpers/date/index.js").DateRange;
        ids?: Partial<{
            calendar: string;
            accessibleHeading: string;
        }> | undefined;
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
