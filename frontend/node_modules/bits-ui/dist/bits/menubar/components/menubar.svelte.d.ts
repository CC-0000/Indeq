import { SvelteComponent } from "svelte";
import type { Props } from "../index.js";
declare const __propDef: {
    props: Props;
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            builder: {
                role: string;
                'data-melt-menubar': string;
                'data-orientation': string;
                id: string;
            } & {
                [x: `data-melt-${string}`]: "";
            } & {
                action: (node: HTMLElement) => {
                    destroy?: undefined;
                } | {
                    destroy: typeof import("@melt-ui/svelte/internal/helpers").noop;
                };
            };
            ids: {
                menubar: string;
            };
        };
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type MenubarProps = typeof __propDef.props;
export type MenubarEvents = typeof __propDef.events;
export type MenubarSlots = typeof __propDef.slots;
export default class Menubar extends SvelteComponent<MenubarProps, MenubarEvents, MenubarSlots> {
}
export {};
