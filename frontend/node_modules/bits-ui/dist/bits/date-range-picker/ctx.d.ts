import { type CreateDateRangePickerProps } from "@melt-ui/svelte";
import type { Writable } from "svelte/store";
import type { FloatingProps } from "../floating/_types.js";
export declare function setCtx(props: CreateDateRangePickerProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getCalendarAttrs: (part: "header" | "root" | "cell" | "grid" | "heading" | "prev-button" | "next-button" | "day" | "grid-head" | "head-cell" | "grid-body" | "grid-row") => Record<string, string> | undefined;
    getFieldAttrs: (part: "label" | "input" | "segment") => Record<string, string> | undefined;
    getPopoverAttrs: (part: "content" | "trigger" | "close" | "arrow") => Record<string, string> | undefined;
    elements: {
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "keydown">, ([$isVisible, $contentId, $triggerId]: [boolean, string, string]) => {
            readonly role: "button";
            readonly "aria-haspopup": "dialog";
            readonly "aria-expanded": "true" | "false";
            readonly "data-state": "open" | "closed";
            readonly "aria-controls": string;
            readonly id: string;
        }, string>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/date-range-picker/events").DateRangePickerEvents["trigger"]>, ([$trigger, $disabled]: [{
            readonly role: "button";
            readonly "aria-haspopup": "dialog";
            readonly "aria-expanded": "true" | "false";
            readonly "data-state": "open" | "closed";
            readonly "aria-controls": string;
            readonly id: string;
        } & {
            [x: `data-melt-${string}`]: "";
        } & {
            action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "keydown">;
        }, boolean]) => {
            "aria-label": string;
            "data-segment": string;
            disabled: boolean | undefined;
            "data-state": "open" | "closed";
            "aria-expanded": "true" | "false";
            "aria-controls": string;
            role: "button";
            id: string;
            "aria-haspopup": "dialog";
        }, "popover-trigger">;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible, $portal, $contentId]: [boolean, string | HTMLElement | null | undefined, string]) => {
            hidden: boolean | undefined;
            tabindex: number;
            style: string;
            id: string;
            "data-state": string;
            "data-portal": string | undefined;
        }, string>;
        arrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
            "data-arrow": boolean;
            style: string;
        }, string>;
        close: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "keydown">, () => {
            readonly type: "button";
        }, string>;
        overlay: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>], <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible]: [boolean]) => {
            readonly hidden: true | undefined;
            readonly tabindex: -1;
            readonly style: string;
            readonly "aria-hidden": "true";
            readonly "data-state": "open" | "closed";
        }, string>;
        field: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<import("@internationalized/date").DateValue | undefined>, import("svelte/store").Readable<boolean>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
        }>], <Node_3 extends any>() => {
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
        startSegment: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj, 12 | 24 | undefined, import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, Set<import("@melt-ui/svelte").SegmentPart>, {
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
        endSegment: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj, 12 | 24 | undefined, import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, Set<import("@melt-ui/svelte").SegmentPart>, {
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
        startHiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
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
        endHiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
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
        calendar: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"keydown">, ([$fullCalendarLabel, $isInvalid, $calendarId, $disabled, $readonly]: [string, boolean, string, boolean, boolean]) => {
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
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "mouseenter">, ([$isSelected, $isSelectionEnd, $isSelectionStart, $highlightedRange, $isDateDisabled, $isDateUnavailable, $placeholder, $isOutsideVisibleMonths,]: [(date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, {
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
        nextButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click">, ([$isNextButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            disabled: boolean | undefined;
            "data-disabled": string | undefined;
        }, string>;
        prevButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click">, ([$isPrevButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            disabled: boolean | undefined;
            "data-disabled": string | undefined;
        }, string>;
    };
    states: {
        open: {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        };
        placeholder: {
            set: (this: void, value: import("@internationalized/date").DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<import("@internationalized/date").DateValue>) => void;
            get: () => import("@internationalized/date").DateValue;
        };
        value: {
            update: (updater: import("svelte/store").Updater<import("@melt-ui/svelte/internal/helpers/date").DateRange>, sideEffect?: ((newValue: import("@melt-ui/svelte/internal/helpers/date").DateRange) => void) | undefined) => void;
            set: (this: void, value: import("@melt-ui/svelte").DateRange) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@melt-ui/svelte").DateRange>, invalidate?: import("svelte/store").Invalidator<import("@melt-ui/svelte").DateRange> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@melt-ui/svelte/internal/helpers/date").DateRange;
            destroy?: (() => void) | undefined;
        };
        months: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Month<import("@internationalized/date").DateValue>[]>>;
        weekdays: import("svelte/store").Readable<string[]>;
        headingValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>;
        startValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        endValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        segmentContents: import("svelte/store").Readable<{
            start: {
                part: import("@melt-ui/svelte").SegmentPart;
                value: string;
            }[];
            end: {
                part: import("@melt-ui/svelte").SegmentPart;
                value: string;
            }[];
        }>;
        endSegmentValues: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>;
        startSegmentValues: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>;
        isInvalid: import("svelte/store").Readable<boolean>;
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
    options: {
        forceVisible: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        preventScroll: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        portal: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>;
        defaultOpen: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        onOpenChange: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined>>;
        positioning: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/actions").FloatingConfig | {
            placement: "bottom";
        }>>;
        arrowSize: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number>>;
        closeOnOutsideClick: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        closeOnEscape: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        onOutsideClick: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<((event: import("@melt-ui/svelte").InteractOutsideEvent) => void) | undefined>>;
        closeFocus: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").FocusProp | undefined>>;
        disableFocusTrap: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        openFocus: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").FocusProp | undefined>>;
        disabled: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        open?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("svelte/store").Writable<boolean> | undefined>> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@melt-ui/svelte").DateRange> | undefined>> | undefined;
        defaultValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").DateRange | undefined>>;
        required?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>> | undefined;
        defaultPlaceholder?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>> | undefined;
        granularity: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Granularity | undefined>>;
        onPlaceholderChange?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@internationalized/date").DateValue> | undefined>> | undefined;
        isDateUnavailable: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Matcher | undefined>>;
        minValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        maxValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        readonly: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        hourCycle: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>;
        locale: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>;
        hideTimeZone: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        weekStartsOn: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined>>;
        fixedWeeks: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        numberOfMonths: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number | undefined>>;
        preventDeselect: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        pagedNavigation: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        weekdayFormat: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<"long" | "short" | "narrow">>;
        isDateDisabled: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Matcher | undefined>>;
        calendarLabel: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
        dateFieldIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
        calendarIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            calendar: string;
            accessibleHeading: string;
        }> | undefined>> | undefined;
        popoverIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            content: string;
            trigger: string;
        }> | undefined>> | undefined;
        startName: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
        endName: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
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
        ids?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            calendar: string;
            accessibleHeading: string;
        }> | undefined>> | import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
        readonlySegments: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<{
            start: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
            end: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
        } | undefined>>;
    };
    ids: {
        rangeField: {
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
        calendar: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
            calendar: string;
            accessibleHeading: string;
        }>;
        popover: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
            content: string;
            trigger: string;
        }>;
    };
};
export declare function getCtx(): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getCalendarAttrs: (part: "header" | "root" | "cell" | "grid" | "heading" | "prev-button" | "next-button" | "day" | "grid-head" | "head-cell" | "grid-body" | "grid-row") => Record<string, string> | undefined;
    getFieldAttrs: (part: "label" | "input" | "segment") => Record<string, string> | undefined;
    getPopoverAttrs: (part: "content" | "trigger" | "close" | "arrow") => Record<string, string> | undefined;
    elements: {
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "keydown">, ([$isVisible, $contentId, $triggerId]: [boolean, string, string]) => {
            readonly role: "button";
            readonly "aria-haspopup": "dialog";
            readonly "aria-expanded": "true" | "false";
            readonly "data-state": "open" | "closed";
            readonly "aria-controls": string;
            readonly id: string;
        }, string>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/date-range-picker/events").DateRangePickerEvents["trigger"]>, ([$trigger, $disabled]: [{
            readonly role: "button";
            readonly "aria-haspopup": "dialog";
            readonly "aria-expanded": "true" | "false";
            readonly "data-state": "open" | "closed";
            readonly "aria-controls": string;
            readonly id: string;
        } & {
            [x: `data-melt-${string}`]: "";
        } & {
            action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "keydown">;
        }, boolean]) => {
            "aria-label": string;
            "data-segment": string;
            disabled: boolean | undefined;
            "data-state": "open" | "closed";
            "aria-expanded": "true" | "false";
            "aria-controls": string;
            role: "button";
            id: string;
            "aria-haspopup": "dialog";
        }, "popover-trigger">;
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible, $portal, $contentId]: [boolean, string | HTMLElement | null | undefined, string]) => {
            hidden: boolean | undefined;
            tabindex: number;
            style: string;
            id: string;
            "data-state": string;
            "data-portal": string | undefined;
        }, string>;
        arrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
            "data-arrow": boolean;
            style: string;
        }, string>;
        close: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "keydown">, () => {
            readonly type: "button";
        }, string>;
        overlay: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>], <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible]: [boolean]) => {
            readonly hidden: true | undefined;
            readonly tabindex: -1;
            readonly style: string;
            readonly "aria-hidden": "true";
            readonly "data-state": "open" | "closed";
        }, string>;
        field: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<import("@internationalized/date").DateValue | undefined>, import("svelte/store").Readable<boolean>, import("svelte/store").Readable<{
            field: string;
            label: string;
            description: string;
            validation: string;
        }>], <Node_3 extends any>() => {
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
        startSegment: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj, 12 | 24 | undefined, import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, Set<import("@melt-ui/svelte").SegmentPart>, {
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
        endSegment: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>, {
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
        }>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusout" | "keydown">, ([$segmentValues, $hourCycle, $placeholder, $value, $isInvalid, $disabled, $readonly, $readonlySegmentsSet, $idValues, _,]: [import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj, 12 | 24 | undefined, import("@internationalized/date").DateValue, import("@internationalized/date").DateValue | undefined, boolean, boolean, boolean, Set<import("@melt-ui/svelte").SegmentPart>, {
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
        startHiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
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
        endHiddenInput: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/motion").Readable<string | undefined>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLInputElement) => {
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
        calendar: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>, import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"keydown">, ([$fullCalendarLabel, $isInvalid, $calendarId, $disabled, $readonly]: [string, boolean, string, boolean, boolean]) => {
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
        }, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<(date: import("@internationalized/date").DateValue) => boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "mouseenter">, ([$isSelected, $isSelectionEnd, $isSelectionStart, $highlightedRange, $isDateDisabled, $isDateUnavailable, $placeholder, $isOutsideVisibleMonths,]: [(date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, (date: import("@internationalized/date").DateValue) => boolean, {
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
        nextButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click">, ([$isNextButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            disabled: boolean | undefined;
            "data-disabled": string | undefined;
        }, string>;
        prevButton: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<boolean>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click">, ([$isPrevButtonDisabled]: [boolean]) => {
            role: string;
            type: "button";
            "aria-label": string;
            "aria-disabled": "true" | undefined;
            disabled: boolean | undefined;
            "data-disabled": string | undefined;
        }, string>;
    };
    states: {
        open: {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        };
        placeholder: {
            set: (this: void, value: import("@internationalized/date").DateValue) => void;
            subscribe: (this: void, run: import("svelte/store").Subscriber<import("@internationalized/date").DateValue>, invalidate?: import("svelte/store").Invalidator<import("@internationalized/date").DateValue> | undefined) => import("svelte/store").Unsubscriber;
            update: (this: void, updater: import("svelte/store").Updater<import("@internationalized/date").DateValue>) => void;
            get: () => import("@internationalized/date").DateValue;
        };
        value: {
            update: (updater: import("svelte/store").Updater<import("@melt-ui/svelte/internal/helpers/date").DateRange>, sideEffect?: ((newValue: import("@melt-ui/svelte/internal/helpers/date").DateRange) => void) | undefined) => void;
            set: (this: void, value: import("@melt-ui/svelte").DateRange) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<import("@melt-ui/svelte").DateRange>, invalidate?: import("svelte/store").Invalidator<import("@melt-ui/svelte").DateRange> | undefined): import("svelte/store").Unsubscriber;
            get: () => import("@melt-ui/svelte/internal/helpers/date").DateRange;
            destroy?: (() => void) | undefined;
        };
        months: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Month<import("@internationalized/date").DateValue>[]>>;
        weekdays: import("svelte/store").Readable<string[]>;
        headingValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Readable<string>>;
        startValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        endValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        segmentContents: import("svelte/store").Readable<{
            start: {
                part: import("@melt-ui/svelte").SegmentPart;
                value: string;
            }[];
            end: {
                part: import("@melt-ui/svelte").SegmentPart;
                value: string;
            }[];
        }>;
        endSegmentValues: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>;
        startSegmentValues: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/dist/builders/date-field/_internal/types").SegmentValueObj>>;
        isInvalid: import("svelte/store").Readable<boolean>;
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
    options: {
        forceVisible: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        preventScroll: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        portal: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>;
        defaultOpen: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        onOpenChange: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined>>;
        positioning: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/actions").FloatingConfig | {
            placement: "bottom";
        }>>;
        arrowSize: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number>>;
        closeOnOutsideClick: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        closeOnEscape: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        onOutsideClick: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<((event: import("@melt-ui/svelte").InteractOutsideEvent) => void) | undefined>>;
        closeFocus: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").FocusProp | undefined>>;
        disableFocusTrap: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        openFocus: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").FocusProp | undefined>>;
        disabled: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        open?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("svelte/store").Writable<boolean> | undefined>> | undefined;
        onValueChange?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@melt-ui/svelte").DateRange> | undefined>> | undefined;
        defaultValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").DateRange | undefined>>;
        required?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>> | undefined;
        defaultPlaceholder?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>> | undefined;
        granularity: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Granularity | undefined>>;
        onPlaceholderChange?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/helpers").ChangeFn<import("@internationalized/date").DateValue> | undefined>> | undefined;
        isDateUnavailable: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Matcher | undefined>>;
        minValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        maxValue: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@internationalized/date").DateValue | undefined>>;
        readonly: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
        hourCycle: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<12 | 24 | undefined>>;
        locale: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>;
        hideTimeZone: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        weekStartsOn: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined>>;
        fixedWeeks: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        numberOfMonths: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<number | undefined>>;
        preventDeselect: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        pagedNavigation: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean | undefined>>;
        weekdayFormat: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<"long" | "short" | "narrow">>;
        isDateDisabled: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte").Matcher | undefined>>;
        calendarLabel: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
        dateFieldIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
        calendarIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            calendar: string;
            accessibleHeading: string;
        }> | undefined>> | undefined;
        popoverIds?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            content: string;
            trigger: string;
        }> | undefined>> | undefined;
        startName: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
        endName: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | undefined>>;
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
        ids?: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            calendar: string;
            accessibleHeading: string;
        }> | undefined>> | import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<Partial<{
            label: string;
            description: string;
            field: string;
            validation: string;
        }> | undefined>> | undefined;
        readonlySegments: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<{
            start: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
            end: ("day" | "hour" | "minute" | "second" | "month" | "year" | "dayPeriod")[];
        } | undefined>>;
    };
    ids: {
        rangeField: {
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
        calendar: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
            calendar: string;
            accessibleHeading: string;
        }>;
        popover: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
            content: string;
            trigger: string;
        }>;
    };
};
export declare function updatePositioning(props: FloatingProps): void;
