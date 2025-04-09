import type { StoresValues, Writable } from "svelte/store";
type Options = Record<string, Writable<unknown>>;
export declare function getOptionUpdater(options: Options): <K extends keyof typeof options, V extends StoresValues<(typeof options)[keyof typeof options]>>(key: K, value: V | undefined) => void;
export {};
