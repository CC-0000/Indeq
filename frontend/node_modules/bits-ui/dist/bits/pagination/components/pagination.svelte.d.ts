import { SvelteComponent } from "svelte";
import type { Props } from "../index.js";
declare const __propDef: {
    props: Props;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                'data-scope': string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
            pages: import("@melt-ui/svelte/index.js").PageItem[];
            range: {
                start: number;
                end: number;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type PaginationProps = typeof __propDef.props;
export type PaginationEvents = typeof __propDef.events;
export type PaginationSlots = typeof __propDef.slots;
export default class Pagination extends SvelteComponent<PaginationProps, PaginationEvents, PaginationSlots> {
}
export {};
