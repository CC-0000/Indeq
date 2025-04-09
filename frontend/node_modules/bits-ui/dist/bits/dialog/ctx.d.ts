import { type CreateDialogProps } from "@melt-ui/svelte";
export declare function getDialogData(): {
    NAME: "dialog";
    PARTS: readonly ["close", "content", "description", "overlay", "portal", "title", "trigger"];
};
type SetProps = CreateDialogProps;
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: SetProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "title" | "content" | "trigger" | "close" | "description" | "overlay" | "portal") => Record<string, string> | undefined;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        title: string;
        description: string;
        content: string;
    }>;
    elements: {
        content: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], (node: HTMLElement) => {
            destroy: () => void;
        }, ([$isVisible, $contentId, $descriptionId, $titleId, $open]: [boolean, string, string, string, boolean]) => {
            id: string;
            role: "dialog" | "alertdialog";
            "aria-describedby": string;
            "aria-labelledby": string;
            "aria-modal": "true" | undefined;
            "data-state": string;
            tabindex: number;
            hidden: boolean | undefined;
            style: string;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/dialog/events").DialogEvents["trigger"]>, ([$open]: [boolean]) => {
            readonly "aria-haspopup": "dialog";
            readonly "aria-expanded": boolean;
            readonly type: "button";
        }, string>;
        title: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$titleId]: [string]) => {
            id: string;
        }, string>;
        description: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$descriptionId]: [string]) => {
            id: string;
        }, string>;
        overlay: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible, $open]: [boolean, boolean]) => {
            readonly hidden: true | undefined;
            readonly tabindex: -1;
            readonly style: string;
            readonly "aria-hidden": true;
            readonly "data-state": "open" | "closed";
        }, string>;
        close: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/dialog/events").DialogEvents["close"]>, () => {
            readonly type: "button";
        }, string>;
        portalled: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, <Node_2 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ($portal: string | HTMLElement | null | undefined) => {
            "data-portal": string | undefined;
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
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        preventScroll: boolean;
        closeOnEscape: boolean;
        closeOnOutsideClick: boolean;
        onOutsideClick: ((event: PointerEvent | MouseEvent | TouchEvent) => void) | undefined;
        role: "dialog" | "alertdialog";
        defaultOpen: boolean;
        open?: import("svelte/store").Writable<boolean> | undefined;
        onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
        portal: string | HTMLElement | null | undefined;
        forceVisible: boolean;
        openFocus: import("@melt-ui/svelte").FocusProp | undefined;
        closeFocus: import("@melt-ui/svelte").FocusProp | undefined;
        ids?: Partial<{
            title: string;
            description: string;
            content: string;
        }> | undefined;
    }, "ids">>;
};
export declare function getCtx(): GetReturn;
export {};
