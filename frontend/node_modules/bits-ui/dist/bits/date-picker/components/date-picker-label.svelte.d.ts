import { SvelteComponent } from "svelte";
import type { LabelProps } from "../index.js";
declare const __propDef: {
    props: LabelProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                id: string;
                'data-invalid': string | undefined;
                'data-disabled': string | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => {
                    destroy: () => void;
                };
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DatePickerLabelProps = typeof __propDef.props;
export type DatePickerLabelEvents = typeof __propDef.events;
export type DatePickerLabelSlots = typeof __propDef.slots;
export default class DatePickerLabel extends SvelteComponent<DatePickerLabelProps, DatePickerLabelEvents, DatePickerLabelSlots> {
}
export {};
