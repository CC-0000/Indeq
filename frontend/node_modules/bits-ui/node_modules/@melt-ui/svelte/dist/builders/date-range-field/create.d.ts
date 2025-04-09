/// <reference types="svelte" />
import type { DateValue } from '@internationalized/date';
import type { CreateDateRangeFieldProps } from './types.js';
declare const rangeFieldIdParts: readonly ["field", "label", "description", "validation"];
export type DateRangeFieldIdParts = typeof rangeFieldIdParts;
export declare function createDateRangeField(props?: CreateDateRangeFieldProps): {
    elements: {
        field: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<DateValue | undefined>, import("svelte/store").Readable<boolean>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
        }>], <Node_1 extends any>() => {
            destroy(): void;
        }, ([$isCompleted, $isInvalid, $ids]: [DateValue | undefined, boolean, {
            field: string;
            label: string;
            description: string;
            validation: string;
        }]) => {
            role: string;
            id: string;
            'aria-labelledby': string;
            'aria-describedby': string;
            'data-invalid': string | undefined;
        }, string>;
        label: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => {
            destroy: () => void;
        }, ([$isInvalid, $disabled, $labelId]: [boolean, boolean, string]) => {
            id: string;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
        }, string>;
        startSegment: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../date-field/_internal/types.js").SegmentValueObj>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }, {
            update: (updater: import("svelte/store").Updater<DateValue | undefined>, sideEffect?: ((newValue: DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => DateValue | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<Set<import("../../index.js").SegmentPart>>>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
            day: string;
            month: string;
            year: string;
            hour: string;
            minute: string;
            second: string;
            dayPeriod: string;
            timeZoneName: string;
        }>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("../../internal/types.js").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("../date-field/_internal/types.js").SegmentValueObj, 12 | 24 | undefined, DateValue, DateValue | undefined, boolean, boolean, boolean, Set<import("../../index.js").SegmentPart>, {
            field: string;
            label: string;
            description: string;
            validation: string;
            day: string;
            month: string;
            year: string;
            hour: string;
            minute: string;
            second: string;
            dayPeriod: string;
            timeZoneName: string;
        }, string]) => (part: import("../../index.js").SegmentPart) => {
            'aria-invalid': "true" | undefined;
            'aria-disabled': "true" | undefined;
            'aria-readonly': "true" | undefined;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
            'data-segment': string;
        } | {
            id: string;
            'aria-labelledby': string;
            contenteditable: boolean;
            'aria-describedby': string | undefined;
            tabindex: number | undefined;
            'aria-invalid': "true" | undefined;
            'aria-disabled': "true" | undefined;
            'aria-readonly': "true" | undefined;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
            'data-segment': string;
        }, string>;
        endSegment: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../date-field/_internal/types.js").SegmentValueObj>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }, {
            update: (updater: import("svelte/store").Updater<DateValue | undefined>, sideEffect?: ((newValue: DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => DateValue | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<Set<import("../../index.js").SegmentPart>>>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
            day: string;
            month: string;
            year: string;
            hour: string;
            minute: string;
            second: string;
            dayPeriod: string;
            timeZoneName: string;
        }>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("../../internal/types.js").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("../date-field/_internal/types.js").SegmentValueObj, 12 | 24 | undefined, DateValue, DateValue | undefined, boolean, boolean, boolean, Set<import("../../index.js").SegmentPart>, {
            field: string;
            label: string;
            description: string;
            validation: string;
            day: string;
            month: string;
            year: string;
            hour: string;
            minute: string;
            second: string;
            dayPeriod: string;
            timeZoneName: string;
        }, string]) => (part: import("../../index.js").SegmentPart) => {
            'aria-invalid': "true" | undefined;
            'aria-disabled': "true" | undefined;
            'aria-readonly': "true" | undefined;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
            'data-segment': string;
        } | {
            id: string;
            'aria-labelledby': string;
            contenteditable: boolean;
            'aria-describedby': string | undefined;
            tabindex: number | undefined;
            'aria-invalid': "true" | undefined;
            'aria-disabled': "true" | undefined;
            'aria-readonly': "true" | undefined;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
            'data-segment': string;
        }, string>;
        startHiddenInput: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            'aria-hidden': "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            style: string;
        }, string>;
        endHiddenInput: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            'aria-hidden': "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            style: string;
        }, string>;
        validation: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$isInvalid, $validationId]: [boolean, string]) => {
            id: string;
            'data-invalid': string | undefined;
            style: string | undefined;
        }, string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<import("../../index.js").DateRange>, sideEffect?: ((newValue: import("../../index.js").DateRange) => void) | undefined) => void;
            set: (this: void, value: import("../../index.js").DateRange) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("../../index.js").DateRange>, invalidate?: import("svelte/store").Invalidator<import("../../index.js").DateRange> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("../../index.js").DateRange;
            destroy?: (() => void) | undefined;
        };
        placeholder: {
            set: (this: void, value: DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<DateValue>) => void;
            get: () => DateValue;
        };
        segmentContents: import("svelte/store").Readable<{
            start: {
                part: import("../../index.js").SegmentPart;
                value: string;
            }[];
            end: {
                part: import("../../index.js").SegmentPart;
                value: string;
            }[];
        }>;
        endSegmentValues: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../date-field/_internal/types.js").SegmentValueObj>>;
        startSegmentValues: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../date-field/_internal/types.js").SegmentValueObj>>;
        isInvalid: import("svelte/store").Readable<boolean>;
    };
    options: {
        endName: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string | undefined>>;
        startName: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string | undefined>>;
        disabled: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>;
        onValueChange?: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../../internal/helpers/index.js").ChangeFn<import("../../index.js").DateRange> | undefined>> | undefined;
        defaultValue: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../../index.js").DateRange>>;
        ids?: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
        required?: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean | undefined>> | undefined;
        defaultPlaceholder?: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<DateValue | undefined>> | undefined;
        granularity: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../../index.js").Granularity | undefined>>;
        onPlaceholderChange?: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../../internal/helpers/index.js").ChangeFn<DateValue> | undefined>> | undefined;
        isDateUnavailable: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../../index.js").Matcher | undefined>>;
        minValue: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<DateValue | undefined>>;
        maxValue: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<DateValue | undefined>>;
        readonly: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>;
        readonlySegments: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<{
            start: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
            end: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
        } | undefined>>;
        hourCycle: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>;
        locale: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>;
        hideTimeZone: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>;
        startIds?: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
            month: string;
            year: string;
            dayPeriod: string;
            timeZoneName: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
        endIds?: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
            month: string;
            year: string;
            dayPeriod: string;
            timeZoneName: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
    };
    ids: {
        field: import("../../internal/helpers/index.js").ToWritableStores<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }>;
        start: import("../../internal/helpers/index.js").ToWritableStores<{
            label: string;
            description: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
            month: string;
            year: string;
            dayPeriod: string;
            timeZoneName: string;
            field: string;
            validation: string;
        }>;
        end: import("../../internal/helpers/index.js").ToWritableStores<{
            label: string;
            description: string;
            day: string;
            hour: string;
            minute: string;
            second: string;
            month: string;
            year: string;
            dayPeriod: string;
            timeZoneName: string;
            field: string;
            validation: string;
        }>;
    };
};
export {};
