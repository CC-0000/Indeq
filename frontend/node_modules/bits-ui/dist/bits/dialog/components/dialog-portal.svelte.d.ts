import { SvelteComponent } from "svelte";
import type { PortalProps } from "../index.js";
declare const __propDef: {
    props: PortalProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                'data-portal': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: <Node_2 extends unknown>(node: HTMLElement) => {
                    destroy(): void;
                };
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DialogPortalProps = typeof __propDef.props;
export type DialogPortalEvents = typeof __propDef.events;
export type DialogPortalSlots = typeof __propDef.slots;
export default class DialogPortal extends SvelteComponent<DialogPortalProps, DialogPortalEvents, DialogPortalSlots> {
}
export {};
