/// <reference types="svelte" />
import type { Mode, ThemeColors } from "./types.js";
/**  the modes that are supported, used for validation & type derivation */
export declare const modes: readonly ["dark", "light", "system"];
/**
 * The key used to store the `mode` in localStorage.
 */
export declare const modeStorageKey: import("svelte/store").Writable<string>;
/**
 * The key used to store the `theme` in localStorage.
 */
export declare const themeStorageKey: import("svelte/store").Writable<string>;
/**
 * Writable store that represents the user's preferred mode (`"dark"`, `"light"` or `"system"`)
 */
export declare const userPrefersMode: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<"dark" | "light" | "system">, invalidate?: import("svelte/store").Invalidator<"dark" | "light" | "system"> | undefined) => import("svelte/store").Unsubscriber;
    set: (v: Mode) => void;
};
/**
 * Readable store that represents the system's preferred mode (`"dark"`, `"light"` or `undefined`)
 */
export declare const systemPrefersMode: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<"dark" | "light" | undefined>, invalidate?: import("svelte/store").Invalidator<"dark" | "light" | undefined> | undefined) => import("svelte/store").Unsubscriber;
    query: () => void;
    tracking: (active: boolean) => void;
};
/**
 * Theme colors for light and dark modes.
 */
export declare const themeColors: import("svelte/store").Writable<ThemeColors>;
/**
 * A custom theme to apply and persist to the root `html` element.
 */
export declare const theme: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<string>, invalidate?: import("svelte/store").Invalidator<string> | undefined) => import("svelte/store").Unsubscriber;
    set: (v: string) => void;
};
/**
 * Whether to disable transitions when changing the mode.
 */
export declare const disableTransitions: import("svelte/store").Writable<boolean>;
/**
 * The classnames to add to the root `html` element when the mode is dark.
 */
export declare const darkClassNames: import("svelte/store").Writable<string[]>;
/**
 * The classnames to add to the root `html` element when the mode is light.
 */
export declare const lightClassNames: import("svelte/store").Writable<string[]>;
/**
 * Derived store that represents the current mode (`"dark"`, `"light"` or `undefined`)
 */
export declare const derivedMode: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<"dark" | "light" | undefined>, invalidate?: import("svelte/store").Invalidator<"dark" | "light" | undefined> | undefined) => import("svelte/store").Unsubscriber;
};
/**
 * Derived store that represents the current custom theme
 */
export declare const derivedTheme: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<string | undefined>, invalidate?: import("svelte/store").Invalidator<string | undefined> | undefined) => import("svelte/store").Unsubscriber;
};
export declare function isValidMode(value: unknown): value is Mode;
