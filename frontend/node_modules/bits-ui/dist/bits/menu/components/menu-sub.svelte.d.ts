import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        disabled?: boolean | undefined;
        open?: boolean | undefined;
        onOpenChange?: import("../../../internal/types.js").OnChangeFn<boolean> | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            subIds: {
                menu: string;
                trigger: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type MenuSubProps = typeof __propDef.props;
export type MenuSubEvents = typeof __propDef.events;
export type MenuSubSlots = typeof __propDef.slots;
export default class MenuSub extends SvelteComponent<MenuSubProps, MenuSubEvents, MenuSubSlots> {
}
export {};
