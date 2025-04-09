import type { Writable } from "svelte/store";
import type { FloatingConfig } from "./floating-config.js";
import type { FloatingProps } from "./_types.js";
export declare function getPositioningUpdater(store: Writable<FloatingConfig>): (props?: FloatingProps) => void;
export declare function updatePositioning(store: Writable<FloatingConfig>, props: FloatingProps): void;
