import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        portal?: (HTMLElement | string | null) | undefined;
        preventScroll?: boolean | undefined;
        closeOnEscape?: boolean | undefined;
        closeOnOutsideClick?: boolean | undefined;
        onOutsideClick?: ((event: PointerEvent | MouseEvent | TouchEvent) => void) | undefined;
        open?: (import("@melt-ui/svelte/index.js").CreateDialogProps["defaultOpen"] & {}) | undefined;
        onOpenChange?: import("../../../internal/types.js").OnChangeFn<boolean> | undefined;
        openFocus?: import("../../../index.js").FocusProp | undefined;
        closeFocus?: import("../../../index.js").FocusProp | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            ids: {
                content: string;
                description: string;
                title: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type DialogProps = typeof __propDef.props;
export type DialogEvents = typeof __propDef.events;
export type DialogSlots = typeof __propDef.slots;
export default class Dialog extends SvelteComponent<DialogProps, DialogEvents, DialogSlots> {
}
export {};
