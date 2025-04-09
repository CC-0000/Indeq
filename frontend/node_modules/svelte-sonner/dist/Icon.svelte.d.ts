import { SvelteComponentTyped } from "svelte";
import type { ToastTypes } from './types.js';
declare const __propDef: {
    props: {
        type?: ToastTypes | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IconProps = typeof __propDef.props;
export type IconEvents = typeof __propDef.events;
export type IconSlots = typeof __propDef.slots;
export default class Icon extends SvelteComponentTyped<IconProps, IconEvents, IconSlots> {
}
export {};
