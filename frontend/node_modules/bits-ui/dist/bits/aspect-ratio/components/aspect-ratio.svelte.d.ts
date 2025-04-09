import { SvelteComponent } from "svelte";
import type { Props } from "../index.js";
declare const __propDef: {
    props: Props;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type AspectRatioProps = typeof __propDef.props;
export type AspectRatioEvents = typeof __propDef.events;
export type AspectRatioSlots = typeof __propDef.slots;
export default class AspectRatio extends SvelteComponent<AspectRatioProps, AspectRatioEvents, AspectRatioSlots> {
}
export {};
