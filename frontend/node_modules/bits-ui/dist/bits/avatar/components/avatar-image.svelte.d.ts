import { SvelteComponent } from "svelte";
import type { ImageProps } from "../index.js";
declare const __propDef: {
    props: ImageProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                src: string;
                style: string;
            } & {
                "data-melt-avatar-image": "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type AvatarImageProps = typeof __propDef.props;
export type AvatarImageEvents = typeof __propDef.events;
export type AvatarImageSlots = typeof __propDef.slots;
export default class AvatarImage extends SvelteComponent<AvatarImageProps, AvatarImageEvents, AvatarImageSlots> {
}
export {};
