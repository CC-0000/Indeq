import { SvelteComponent } from "svelte";
import type { NextButtonProps } from "../index.js";
declare const __propDef: {
    props: NextButtonProps;
    slots: {
        default: {
            builder: {
                role: string;
                type: "button";
                'aria-label': string;
                'aria-disabled': "true" | undefined;
                'data-disabled': string | undefined;
                disabled: boolean | undefined;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click">;
            };
        };
    };
    events: {
        click: import("../../../index.js").CustomEventHandler<MouseEvent, HTMLButtonElement>;
    };
};
export type DatePickerNextButtonProps = typeof __propDef.props;
export type DatePickerNextButtonEvents = typeof __propDef.events;
export type DatePickerNextButtonSlots = typeof __propDef.slots;
export default class DatePickerNextButton extends SvelteComponent<DatePickerNextButtonProps, DatePickerNextButtonEvents, DatePickerNextButtonSlots> {
}
export {};
