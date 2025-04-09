import { SvelteComponent } from "svelte";
import type { ContentProps } from "../index.js";
declare const __propDef: {
    props: ContentProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                style: string;
                id: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: <Node_3 extends unknown>(node: HTMLElement) => {
                    destroy(): void;
                };
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ScrollAreaContentProps = typeof __propDef.props;
export type ScrollAreaContentEvents = typeof __propDef.events;
export type ScrollAreaContentSlots = typeof __propDef.slots;
export default class ScrollAreaContent extends SvelteComponent<ScrollAreaContentProps, ScrollAreaContentEvents, ScrollAreaContentSlots> {
}
export {};
