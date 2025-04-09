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
export type DateRangeFieldLabelProps = typeof __propDef.props;
export type DateRangeFieldLabelEvents = typeof __propDef.events;
export type DateRangeFieldLabelSlots = typeof __propDef.slots;
export default class DateRangeFieldLabel extends SvelteComponent<DateRangeFieldLabelProps, DateRangeFieldLabelEvents, DateRangeFieldLabelSlots> {
}
export {};
