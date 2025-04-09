import { SvelteComponent } from "svelte";
import type { Props } from "../index.js";
declare class __sveltets_Render<T extends "single" | "multiple"> {
    props(): Props<T>;
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
export type ToggleGroupProps<T extends "single" | "multiple"> = ReturnType<__sveltets_Render<T>['props']>;
export type ToggleGroupEvents<T extends "single" | "multiple"> = ReturnType<__sveltets_Render<T>['events']>;
export type ToggleGroupSlots<T extends "single" | "multiple"> = ReturnType<__sveltets_Render<T>['slots']>;
export default class ToggleGroup<T extends "single" | "multiple"> extends SvelteComponent<ToggleGroupProps<T>, ToggleGroupEvents<T>, ToggleGroupSlots<T>> {
}
export {};
