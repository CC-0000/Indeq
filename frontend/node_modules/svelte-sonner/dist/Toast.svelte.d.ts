import { SvelteComponentTyped } from "svelte";
import type { ToastClassnames, ToastProps } from './types';
declare const __propDef: {
    props: {
        toast: import("./types").ToastT<import("svelte").ComponentType>;
        index: number;
        expanded: boolean;
        invert: boolean;
        position: import("./types").Position;
        visibleToasts: number;
        expandByDefault: boolean;
        closeButton: boolean;
        interacting: boolean;
        cancelButtonStyle: string;
        actionButtonStyle: string;
        duration: number;
        class: string;
        descriptionClass: string;
        classes: ToastClassnames;
        unstyled: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        'loading-icon': {};
        'success-icon': {};
        'error-icon': {};
        'warning-icon': {};
        'info-icon': {};
    };
};
type ToastProps_ = typeof __propDef.props;
export { ToastProps_ as ToastProps };
export type ToastEvents = typeof __propDef.events;
export type ToastSlots = typeof __propDef.slots;
export default class Toast extends SvelteComponentTyped<ToastProps, ToastEvents, ToastSlots> {
}
