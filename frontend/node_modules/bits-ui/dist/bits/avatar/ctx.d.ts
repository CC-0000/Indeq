import { type Avatar as AvatarReturn, type CreateAvatarProps } from "@melt-ui/svelte";
export declare function getAvatarData(): {
    NAME: "avatar";
    PARTS: readonly ["root", "image", "fallback"];
};
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
export declare function setCtx(props: CreateAvatarProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "image" | "root" | "fallback") => Record<string, string> | undefined;
    elements: {
        image: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, {
            update: (updater: import("svelte/store").Updater<"error" | "loading" | "loaded">, sideEffect?: ((newValue: "error" | "loading" | "loaded") => void) | undefined) => void;
            set: (this: void, value: "error" | "loading" | "loaded") => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<"error" | "loading" | "loaded">, invalidate?: import("svelte/store").Invalidator<"error" | "loading" | "loaded"> | undefined): import("svelte/store").Unsubscriber;
            get: () => "error" | "loading" | "loaded";
            destroy?: (() => void) | undefined;
        }], import("svelte/action").Action<any, any, Record<never, any>>, ([$src, $loadingStatus]: [string, "error" | "loading" | "loaded"]) => {
            src: string;
            style: string;
        }, "avatar-image">;
        fallback: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<"error" | "loading" | "loaded">, sideEffect?: ((newValue: "error" | "loading" | "loaded") => void) | undefined) => void;
            set: (this: void, value: "error" | "loading" | "loaded") => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<"error" | "loading" | "loaded">, invalidate?: import("svelte/store").Invalidator<"error" | "loading" | "loaded"> | undefined): import("svelte/store").Unsubscriber;
            get: () => "error" | "loading" | "loaded";
            destroy?: (() => void) | undefined;
        }], import("svelte/action").Action<any, any, Record<never, any>>, ([$loadingStatus]: ["error" | "loading" | "loaded"]) => {
            style: string | undefined;
            hidden: boolean | undefined;
        }, "avatar-fallback">;
    };
    states: {
        loadingStatus: {
            update: (updater: import("svelte/store").Updater<"error" | "loading" | "loaded">, sideEffect?: ((newValue: "error" | "loading" | "loaded") => void) | undefined) => void;
            set: (this: void, value: "error" | "loading" | "loaded") => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<"error" | "loading" | "loaded">, invalidate?: import("svelte/store").Invalidator<"error" | "loading" | "loaded"> | undefined): import("svelte/store").Unsubscriber;
            get: () => "error" | "loading" | "loaded";
            destroy?: (() => void) | undefined;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        src: string;
        delayMs: number;
        loadingStatus?: import("svelte/store").Writable<"error" | "loading" | "loaded"> | undefined;
        onLoadingStatusChange: import("@melt-ui/svelte/internal/helpers").ChangeFn<"error" | "loading" | "loaded"> | undefined;
    }, "loadingStatus" | "onLoadingStatusChange">>;
};
export declare function getImage(src?: string | undefined | null): AvatarReturn;
export declare function getCtx(): GetReturn;
export {};
