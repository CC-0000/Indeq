import { SvelteComponent } from "svelte";
import type { FallbackProps } from "../index.js";
declare const __propDef: {
    props: FallbackProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                style: string | undefined;
                hidden: boolean | undefined;
            } & {
                "data-melt-avatar-fallback": "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type AvatarFallbackProps = typeof __propDef.props;
export type AvatarFallbackEvents = typeof __propDef.events;
export type AvatarFallbackSlots = typeof __propDef.slots;
export default class AvatarFallback extends SvelteComponent<AvatarFallbackProps, AvatarFallbackEvents, AvatarFallbackSlots> {
}
export {};
