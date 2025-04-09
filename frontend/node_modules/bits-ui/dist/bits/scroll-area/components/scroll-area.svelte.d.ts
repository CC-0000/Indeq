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
                style: string;
                id: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: <Node_1 extends unknown>(node: HTMLElement) => {
                    destroy(): void;
                };
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ScrollAreaProps = typeof __propDef.props;
export type ScrollAreaEvents = typeof __propDef.events;
export type ScrollAreaSlots = typeof __propDef.slots;
export default class ScrollArea extends SvelteComponent<ScrollAreaProps, ScrollAreaEvents, ScrollAreaSlots> {
}
export {};
