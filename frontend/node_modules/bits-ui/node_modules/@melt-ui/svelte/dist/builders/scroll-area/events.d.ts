import type { GroupedEvents } from '../../internal/types.js';
export declare const scrollAreaEvents: {
    readonly scrollbar: readonly ["pointerdown", "pointerup", "pointermove"];
    readonly thumb: readonly ["pointerdown", "pointerup"];
};
export type ScrollAreaEvents = GroupedEvents<typeof scrollAreaEvents>;
