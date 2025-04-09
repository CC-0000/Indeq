import type { GroupedEvents, MeltComponentEvents } from '../../internal/types.js';
export declare const treeEvents: {
    item: readonly ["keydown", "click", "focus"];
};
export type TreeEvents = GroupedEvents<typeof treeEvents>;
export type TreeComponentEvents = MeltComponentEvents<TreeEvents>;
