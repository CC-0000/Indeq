import { SvelteComponent } from "svelte";
import type { InputProps } from "../index.js";
declare const __propDef: {
    props: InputProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
                id: string;
                'aria-labelledby': string;
                'aria-describedby': string;
                'aria-disabled': "true" | undefined;
                'aria-readonly': "true" | undefined;
                'data-invalid': string | undefined;
                'data-disabled': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: <Node_1 extends unknown>(_node: HTMLElement) => {
                    destroy(): void;
                };
            };
            segments: {
                part: import("@melt-ui/svelte/index.js").SegmentPart;
                value: string;
            }[];
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DateFieldInputProps = typeof __propDef.props;
export type DateFieldInputEvents = typeof __propDef.events;
export type DateFieldInputSlots = typeof __propDef.slots;
export default class DateFieldInput extends SvelteComponent<DateFieldInputProps, DateFieldInputEvents, DateFieldInputSlots> {
}
export {};
