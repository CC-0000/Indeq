import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        portal?: (HTMLElement | string | null) | undefined;
        closeOnEscape?: boolean | undefined;
        closeOnOutsideClick?: boolean | undefined;
        onOutsideClick?: ((event: import("@melt-ui/svelte/index.js").InteractOutsideEvent) => void) | undefined;
        openDelay?: number | undefined;
        closeDelay?: number | undefined;
        open?: boolean | undefined;
        onOpenChange?: import("../../../internal/types.js").OnChangeFn<boolean> | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            ids: {
                content: string;
                trigger: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type LinkPreviewProps = typeof __propDef.props;
export type LinkPreviewEvents = typeof __propDef.events;
export type LinkPreviewSlots = typeof __propDef.slots;
export default class LinkPreview extends SvelteComponent<LinkPreviewProps, LinkPreviewEvents, LinkPreviewSlots> {
}
export {};
