import { SvelteComponent } from "svelte";
import type { PrevButtonProps } from "../index.js";
declare const __propDef: {
    props: PrevButtonProps;
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
export type DatePickerPrevButtonProps = typeof __propDef.props;
export type DatePickerPrevButtonEvents = typeof __propDef.events;
export type DatePickerPrevButtonSlots = typeof __propDef.slots;
export default class DatePickerPrevButton extends SvelteComponent<DatePickerPrevButtonProps, DatePickerPrevButtonEvents, DatePickerPrevButtonSlots> {
}
export {};
