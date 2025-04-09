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
                id: string;
                'data-complete': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: import("svelte/action").Action<any, any, Record<never, any>>;
            };
            ids: {
                menubar: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type PinInputProps = typeof __propDef.props;
export type PinInputEvents = typeof __propDef.events;
export type PinInputSlots = typeof __propDef.slots;
export default class PinInput extends SvelteComponent<PinInputProps, PinInputEvents, PinInputSlots> {
}
export {};
