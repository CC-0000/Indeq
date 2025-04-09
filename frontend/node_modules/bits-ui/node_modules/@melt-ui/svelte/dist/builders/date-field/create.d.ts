/// <reference types="svelte" />
import type { MeltActionReturn } from '../../internal/types.js';
import type { DateValue } from '@internationalized/date';
import { type Updater } from 'svelte/store';
import type { SegmentPart } from './_internal/types.js';
import type { DateFieldEvents } from './events.js';
import type { CreateDateFieldProps } from './types.js';
declare const dateFieldIdParts: readonly ["field", "label", "description", "validation", "day", "month", "year", "hour", "minute", "second", "dayPeriod", "timeZoneName"];
export type DateFieldIdParts = typeof dateFieldIdParts;
export declare function createDateField(props?: CreateDateFieldProps): {
    elements: {
        field: import("../../internal/helpers/index.js").MeltElement<[{
            update: (updater: Updater<DateValue | undefined>, sideEffect?: ((newValue: DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => DateValue | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
        }>], <Node_1 extends any>(_node: HTMLElement) => {
            destroy(): void;
        }, ([$value, $isInvalid, $disabled, $readonly, $ids]: [DateValue | undefined, boolean, boolean, boolean, {
            field: string;
            label: string;
            description: string;
            validation: string;
        }]) => {
            role: string;
            id: string;
            'aria-labelledby': string;
            'aria-describedby': string;
            'aria-disabled': "true" | undefined;
            'aria-readonly': "true" | undefined;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
        }, string>;
        segment: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("./_internal/types.js").SegmentValueObj>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
            get: () => DateValue;
            set: (this: void, value: DateValue) => void;
            update: (this: void, updater: Updater<DateValue>) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
            add: (duration: import("@internationalized/date").DateTimeDuration | import("@internationalized/date").DateDuration) => void;
            subtract: (duration: import("@internationalized/date").DateTimeDuration | import("@internationalized/date").DateDuration) => void;
            setDate: (fields: import("@internationalized/date").DateFields | (import("@internationalized/date").DateFields & import("@internationalized/date").TimeFields), disambiguation?: import("@internationalized/date").Disambiguation | undefined) => void;
            reset: () => void;
            toWritable: () => {
                set: (this: void, value: DateValue) => void;
                subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
                update: (this: void, updater: Updater<DateValue>) => void;
                get: () => DateValue;
            };
            nextPage: (amount: number) => void;
            prevPage: (amount: number) => void;
        }, {
            update: (updater: Updater<DateValue | undefined>, sideEffect?: ((newValue: DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => DateValue | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<Set<SegmentPart>>>, import("svelte/store").Readable<{
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
        }>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<DateFieldEvents['segment']>, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("./_internal/types.js").SegmentValueObj, 12 | 24 | undefined, DateValue, DateValue | undefined, boolean, boolean, boolean, Set<SegmentPart>, {
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
        }, string]) => (part: SegmentPart) => {
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
        label: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => {
            destroy: () => void;
        }, ([$isInvalid, $disabled, $labelId]: [boolean, boolean, string]) => {
            id: string;
            'data-invalid': string | undefined;
            'data-disabled': string | undefined;
        }, string>;
        hiddenInput: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<boolean>>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
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
        validation: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$isInvalid, $validationId]: [boolean, string]) => {
            id: string;
            'data-invalid': string | undefined;
            style: string | undefined;
        }, string>;
    };
    states: {
        value: {
            update: (updater: Updater<DateValue | undefined>, sideEffect?: ((newValue: DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => DateValue | undefined;
            destroy?: (() => void) | undefined;
        };
        segmentValues: import("../../internal/helpers/index.js").WithGet<import("svelte/store").Writable<import("./_internal/types.js").SegmentValueObj>>;
        segmentContents: import("svelte/store").Readable<{
            part: SegmentPart;
            value: string;
        }[]>;
        segmentContentsObj: import("svelte/store").Readable<import("./_internal/types.js").SegmentContentObj>;
        placeholder: {
            set: (this: void, value: DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<DateValue>, invalidate?: import("svelte/store").Invalidator<DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: Updater<DateValue>) => void;
            get: () => DateValue;
        };
        isInvalid: import("svelte/store").Readable<boolean>;
    };
    helpers: {
        isDateUnavailable: import("svelte/store").Readable<(date: DateValue) => boolean | undefined>;
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        defaultValue?: DateValue | undefined;
        onValueChange?: import("../../internal/helpers/index.js").ChangeFn<DateValue | undefined> | undefined;
        value: import("svelte/store").Writable<DateValue | undefined> | undefined;
        defaultPlaceholder?: DateValue | undefined;
        placeholder?: import("svelte/store").Writable<DateValue> | undefined;
        onPlaceholderChange?: import("../../internal/helpers/index.js").ChangeFn<DateValue> | undefined;
        isDateUnavailable: import("../../internal/helpers/date/index.js").Matcher | undefined;
        minValue: DateValue | undefined;
        maxValue: DateValue | undefined;
        disabled: boolean;
        readonly: boolean;
        readonlySegments: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[] | undefined;
        hourCycle: 12 | 24 | undefined;
        locale: string;
        granularity: import("../../internal/helpers/date/index.js").Granularity | undefined;
        hideTimeZone: boolean;
        name: string | undefined;
        required: boolean;
        ids?: Partial<{
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
        }> | undefined;
    }, "value" | "ids" | "placeholder">>;
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
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
export {};
