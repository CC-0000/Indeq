import { SvelteComponent } from "svelte";
import type { Events, Props } from "../index.js";
declare const __propDef: {
    props: Props;
    slots: {
        default: {};
    };
    events: Events;
};
export type ButtonProps = typeof __propDef.props;
export type ButtonEvents = typeof __propDef.events;
export type ButtonSlots = typeof __propDef.slots;
export default class Button extends SvelteComponent<ButtonProps, ButtonEvents, ButtonSlots> {
}
export {};
