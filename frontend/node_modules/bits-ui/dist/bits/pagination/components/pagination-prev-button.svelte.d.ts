import { SvelteComponent } from "svelte";
import type { PrevButtonProps } from "../index.js";
declare const __propDef: {
    props: PrevButtonProps;
    slots: {
        default: {
            builder: {
                readonly 'aria-label': "Previous";
                readonly disabled: boolean;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pagination/events.js").PaginationEvents["prevButton"]>;
            };
        };
    };
    events: {
        click: import("../../../index.js").CustomEventHandler<MouseEvent, HTMLDivElement>;
    };
};
export type PaginationPrevButtonProps = typeof __propDef.props;
export type PaginationPrevButtonEvents = typeof __propDef.events;
export type PaginationPrevButtonSlots = typeof __propDef.slots;
export default class PaginationPrevButton extends SvelteComponent<PaginationPrevButtonProps, PaginationPrevButtonEvents, PaginationPrevButtonSlots> {
}
export {};
