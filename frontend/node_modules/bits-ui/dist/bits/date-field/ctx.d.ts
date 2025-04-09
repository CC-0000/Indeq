import { type CreateDateFieldProps } from "@melt-ui/svelte";
export declare function getDateFieldData(): {
    NAME: "date-field";
    PARTS: readonly ["label", "input", "segment"];
};
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateDateFieldProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "label" | "input" | "segment") => Record<string, string> | undefined;
    elements: {
        field: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<import("@internationalized/date").DateValue | undefined>, sideEffect?: ((newValue: import("@internationalized/date").DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: import("@internationalized/date").DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@internationalized/date").DateValue | undefined;
            destroy?: (() => void) | undefined;
        }, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
        }>], <Node_1 extends any>(_node: HTMLElement) => {
            destroy(): void;
        }, ([$value, $isInvalid, $disabled, $readonly, $ids]: [import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, {
            field: string;
            label: string;
            description: string;
            validation: string;
        }]) => {
            role: string;
            id: string;
            "aria-labelledby": string;
            "aria-describedby": string;
            "aria-disabled": "true" | undefined;
            "aria-readonly": "true" | undefined;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
        }, string>;
        segment: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<Set<import("@melt-ui/svelte").SegmentPart>>>, import("svelte/store").Readable<{
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
        }>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/date-field/events").DateFieldEvents["segment"]>, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj, 12 | 24 | undefined, import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, Set<import("@melt-ui/svelte").SegmentPart>, {
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
        }, string]) => (part: import("@melt-ui/svelte").SegmentPart) => {
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
        label: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => {
            destroy: () => void;
        }, ([$isInvalid, $disabled, $labelId]: [boolean, boolean, string]) => {
            id: string;
            "data-invalid": string | undefined;
            "data-disabled": string | undefined;
        }, string>;
        hiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
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
        validation: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$isInvalid, $validationId]: [boolean, string]) => {
            id: string;
            "data-invalid": string | undefined;
            style: string | undefined;
        }, string>;
    };
    states: {
        value: {
            update: (updater: import("svelte/store").Updater<import("@internationalized/date").DateValue | undefined>, sideEffect?: ((newValue: import("@internationalized/date").DateValue | undefined) => void) | undefined) => void;
            set: (this: void, value: import("@internationalized/date").DateValue | undefined) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue | undefined>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue | undefined> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@internationalized/date").DateValue | undefined;
            destroy?: (() => void) | undefined;
        };
        segmentValues: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>;
        segmentContents: import("svelte/store").Readable<{
            part: import("@melt-ui/svelte").SegmentPart;
            value: string;
        }[]>;
        segmentContentsObj: import("svelte/store").Readable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentContentObj>;
        placeholder: {
            set: (this: void, value: import("@internationalized/date").DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<import("@internationalized/date").DateValue>) => void;
            get: () => import("@internationalized/date").DateValue;
        };
        isInvalid: import("svelte/store").Readable<boolean>;
    };
    helpers: {
        isDateUnavailable: import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean | undefined>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        defaultValue?: import("@internationalized/date").DateValue | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@internationalized/date").DateValue | undefined> | undefined;
        value: import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined> | undefined;
        defaultPlaceholder?: import("@internationalized/date").DateValue | undefined;
        placeholder?: import("svelte/store").Writable<import("@internationalized/date").DateValue> | undefined;
        onPlaceholderChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@internationalized/date").DateValue> | undefined;
        isDateUnavailable: import("@melt-ui/svelte").Matcher | undefined;
        minValue: import("@internationalized/date").DateValue | undefined;
        maxValue: import("@internationalized/date").DateValue | undefined;
        disabled: boolean;
        readonly: boolean;
        readonlySegments: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[] | undefined;
        hourCycle: 12 | 24 | undefined;
        locale: string;
        granularity: import("@melt-ui/svelte").Granularity | undefined;
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
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
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
export declare function getCtx(): GetReturn;
export {};
