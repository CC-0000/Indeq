import { SvelteComponent } from "svelte";
import type { PageProps } from "../index.js";
declare const __propDef: {
    props: PageProps;
    slots: {
        default: {
            builder: {
                'aria-label': string;
                'data-value': number;
                'data-selected': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/pagination/events.js").PaginationEvents["pageTrigger"]>;
            };
        };
    };
    events: {
        click: import("../../../index.js").CustomEventHandler<MouseEvent, HTMLDivElement>;
    };
};
export type PaginationPageProps = typeof __propDef.props;
export type PaginationPageEvents = typeof __propDef.events;
export type PaginationPageSlots = typeof __propDef.slots;
export default class PaginationPage extends SvelteComponent<PaginationPageProps, PaginationPageEvents, PaginationPageSlots> {
}
export {};
