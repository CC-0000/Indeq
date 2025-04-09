import { type CreateSeparatorProps } from "@melt-ui/svelte";
export declare function setCtx(props: CreateSeparatorProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<import("svelte/store").Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "root") => Record<string, string> | undefined;
    elements: {
        root: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$orientation, $decorative]: [import("@melt-ui/svelte/internal/types").Orientation, boolean]) => {
            role: string;
            "aria-orientation": "vertical" | undefined;
            "aria-hidden": boolean;
            "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, "separator">;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        orientation: import("@melt-ui/svelte/internal/types").Orientation;
        decorative: boolean;
    }>;
};
