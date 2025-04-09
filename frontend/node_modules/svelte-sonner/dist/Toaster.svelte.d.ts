import { SvelteComponentTyped } from "svelte";
import type { ToasterProps } from './types.js';
declare const __propDef: {
    props: ToasterProps;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'loading-icon': {
            slot: string;
        };
        'success-icon': {
            slot: string;
        };
        'error-icon': {
            slot: string;
        };
        'warning-icon': {
            slot: string;
        };
        'info-icon': {
            slot: string;
        };
    };
};
type ToasterProps_ = typeof __propDef.props;
export { ToasterProps_ as ToasterProps };
export type ToasterEvents = typeof __propDef.events;
export type ToasterSlots = typeof __propDef.slots;
export default class Toaster extends SvelteComponentTyped<ToasterProps, ToasterEvents, ToasterSlots> {
}
