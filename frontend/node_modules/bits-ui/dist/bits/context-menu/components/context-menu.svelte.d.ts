import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        dir?: import("@melt-ui/svelte/internal/types").TextDirection | undefined;
        portal?: (HTMLElement | string | null) | undefined;
        preventScroll?: boolean | undefined;
        closeOnEscape?: boolean | undefined;
        closeOnOutsideClick?: boolean | undefined;
        onOutsideClick?: ((event: import("@melt-ui/svelte/index.js").InteractOutsideEvent) => void) | undefined;
        closeFocus?: import("@melt-ui/svelte/index.js").FocusProp | undefined;
        typeahead?: boolean | undefined;
        loop?: boolean | undefined;
        disableFocusFirstItem?: boolean | undefined;
        closeOnItemClick?: boolean | undefined;
        open?: boolean | undefined;
        onOpenChange?: import("../../../internal/types.js").OnChangeFn<boolean> | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            ids: {
                menu: string;
                trigger: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type ContextMenuProps = typeof __propDef.props;
export type ContextMenuEvents = typeof __propDef.events;
export type ContextMenuSlots = typeof __propDef.slots;
export default class ContextMenu extends SvelteComponent<ContextMenuProps, ContextMenuEvents, ContextMenuSlots> {
}
export {};
