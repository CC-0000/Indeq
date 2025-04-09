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
export type MenubarSubProps = typeof __propDef.props;
export type MenubarSubEvents = typeof __propDef.events;
export type MenubarSubSlots = typeof __propDef.slots;
export default class MenubarSub extends SvelteComponent<MenubarSubProps, MenubarSubEvents, MenubarSubSlots> {
}
export {};
