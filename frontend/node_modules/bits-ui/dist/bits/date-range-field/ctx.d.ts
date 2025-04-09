import { type CreateDateRangeFieldProps } from "@melt-ui/svelte";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateDateRangeFieldProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "label" | "input" | "segment") => Record<string, string> | undefined;
    elements: {
        field: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<import("@internationalized/date").DateValue | undefined>, import("svelte/store").Readable<boolean>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
        }>], <Node_1 extends any>() => {
            destroy(): void;
        }, ([$isCompleted, $isInvalid, $ids]: [import("@internationalized/date").DateValue | undefined, boolean, {
            field: string;
            label: string;
            description: string;
            validation: string;
        }]) => {
            role: string;
            id: string;
            "aria-labelledby": string;
            "aria-describedby": string;
            "data-invalid": string | undefined;
        }, string>;
        label: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => {
            destroy: () => void;
        }, ([$isInvalid, $disabled, $labelId]: [boolean, boolean, string]) => {
            id: string;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
        }, string>;
        startSegment: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types.js").SegmentValueObj>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }, {
            update: (updater: import("svelte/store").Updater<import("@internationalized/date").DateValue | undefined>, sideEffect?: ((newValue: import("@internationalized/date").DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: import("@internationalized/date").DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@internationalized/date").DateValue | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<Set<import("@melt-ui/svelte/index.js").SegmentPart>>>, import("svelte/store").Readable<{
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
        }>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("@melt-ui/svelte/dist/builders/date-field/_internal/types.js").SegmentValueObj, 12 | 24 | undefined, import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, Set<import("@melt-ui/svelte/index.js").SegmentPart>, {
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
        }, string]) => (part: import("@melt-ui/svelte/index.js").SegmentPart) => {
            "aria-invalid": "true" | undefined;
            "aria-disabled": "true" | undefined;
            "aria-readonly": "true" | undefined;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
            "data-segment": string;
        } | {
            id: string;
            "aria-labelledby": string;
            contenteditable: boolean;
            "aria-describedby": string | undefined;
            tabindex: number | undefined;
            "aria-invalid": "true" | undefined;
            "aria-disabled": "true" | undefined;
            "aria-readonly": "true" | undefined;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
            "data-segment": string;
        }, string>;
        endSegment: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types.js").SegmentValueObj>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }, {
            update: (updater: import("svelte/store").Updater<import("@internationalized/date").DateValue | undefined>, sideEffect?: ((newValue: import("@internationalized/date").DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: import("@internationalized/date").DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@internationalized/date").DateValue | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<Set<import("@melt-ui/svelte/index.js").SegmentPart>>>, import("svelte/store").Readable<{
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
        }>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("@melt-ui/svelte/dist/builders/date-field/_internal/types.js").SegmentValueObj, 12 | 24 | undefined, import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, Set<import("@melt-ui/svelte/index.js").SegmentPart>, {
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
        }, string]) => (part: import("@melt-ui/svelte/index.js").SegmentPart) => {
            "aria-invalid": "true" | undefined;
            "aria-disabled": "true" | undefined;
            "aria-readonly": "true" | undefined;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
            "data-segment": string;
        } | {
            id: string;
            "aria-labelledby": string;
            contenteditable: boolean;
            "aria-describedby": string | undefined;
            tabindex: number | undefined;
            "aria-invalid": "true" | undefined;
            "aria-disabled": "true" | undefined;
            "aria-readonly": "true" | undefined;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
            "data-segment": string;
        }, string>;
        startHiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            "aria-hidden": "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            style: string;
        }, string>;
        endHiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
            destroy: import("svelte/store").Unsubscriber;
        }, ([$value, $name, $disabled, $required]: [string, string | undefined, boolean, boolean]) => {
            name: string | undefined;
            value: string;
            "aria-hidden": "true";
            hidden: boolean;
            disabled: boolean;
            required: boolean;
            tabIndex: number;
            style: string;
        }, string>;
        validation: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$isInvalid, $validationId]: [boolean, string]) => {
            id: string;
            "data-invalid": string | undefined;
            style: string | undefined;
        }, string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<import("@melt-ui/svelte/index.js").DateRange>, sideEffect?: ((newValue: import("@melt-ui/svelte/index.js").DateRange) => void) | undefined) => void;
            set: (this: void, value: import("@melt-ui/svelte/index.js").DateRange) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@melt-ui/svelte/index.js").DateRange>, invalidate?: import("svelte/store").Invalidator<import("@melt-ui/svelte/index.js").DateRange> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@melt-ui/svelte/index.js").DateRange;
            destroy?: (() => void) | undefined;
        };
        placeholder: {
            set: (this: void, value: import("@internationalized/date").DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<import("@internationalized/date").DateValue>) => void;
            get: () => import("@internationalized/date").DateValue;
        };
        segmentContents: import("svelte/store").Readable<{
            start: {
                part: import("@melt-ui/svelte/index.js").SegmentPart;
                value: string;
            }[];
            end: {
                part: import("@melt-ui/svelte/index.js").SegmentPart;
                value: string;
            }[];
        }>;
        endSegmentValues: import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types.js").SegmentValueObj>>;
        startSegmentValues: import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types.js").SegmentValueObj>>;
        isInvalid: import("svelte/store").Readable<boolean>;
    };
    options: {
        endName: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
        startName: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
        disabled: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@melt-ui/svelte/index.js").DateRange> | undefined>> | undefined;
        defaultValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/index.js").DateRange>>;
        ids?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
        required?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>> | undefined;
        defaultPlaceholder?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>> | undefined;
        granularity: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/index.js").Granularity | undefined>>;
        onPlaceholderChange?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@internationalized/date").DateValue> | undefined>> | undefined;
        isDateUnavailable: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/index.js").Matcher | undefined>>;
        minValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        maxValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        readonly: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        readonlySegments: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<{
            start: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
            end: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
        } | undefined>>;
        hourCycle: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>;
        locale: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>;
        hideTimeZone: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        startIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
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
        endIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
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
        field: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }>;
        start: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
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
        end: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
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
export declare function getCtx(): GetReturn;
export {};
