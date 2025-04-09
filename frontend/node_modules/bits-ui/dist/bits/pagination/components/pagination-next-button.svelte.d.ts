import { SvelteComponent } from "svelte";
import type { NextButtonProps } from "../index.js";
declare const __propDef: {
    props: NextButtonProps;
    slots: {
        default: {
            builder: {
                readonly 'aria-label': "Next";
                readonly disabled: boolean;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pagination/events.js").PaginationEvents["nextButton"]>;
            };
        };
    };
    events: {
        click: import("../../../index.js").CustomEventHandler<MouseEvent, HTMLDivElement>;
    };
};
export type PaginationNextButtonProps = typeof __propDef.props;
export type PaginationNextButtonEvents = typeof __propDef.events;
export type PaginationNextButtonSlots = typeof __propDef.slots;
export default class PaginationNextButton extends SvelteComponent<PaginationNextButtonProps, PaginationNextButtonEvents, PaginationNextButtonSlots> {
}
export {};
