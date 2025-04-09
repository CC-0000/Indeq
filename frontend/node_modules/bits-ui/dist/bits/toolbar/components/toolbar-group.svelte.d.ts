import { SvelteComponent } from "svelte";
import type { GroupProps } from "../index.js";
declare class __sveltets_Render<T extends "single" | "multiple"> {
    props(): GroupProps<T>;
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            builder: {
                readonly role: "group";
                readonly 'data-orientation': import("@melt-ui/svelte/internal/types").Orientation;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
}
export type ToolbarGroupProps<T extends "single" | "multiple"> = ReturnType<__sveltets_Render<T>['props']>;
export type ToolbarGroupEvents<T extends "single" | "multiple"> = ReturnType<__sveltets_Render<T>['events']>;
export type ToolbarGroupSlots<T extends "single" | "multiple"> = ReturnType<__sveltets_Render<T>['slots']>;
export default class ToolbarGroup<T extends "single" | "multiple"> extends SvelteComponent<ToolbarGroupProps<T>, ToolbarGroupEvents<T>, ToolbarGroupSlots<T>> {
}
export {};
