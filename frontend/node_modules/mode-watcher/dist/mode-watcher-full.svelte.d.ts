import { SvelteComponent } from "svelte";
import { setInitialMode } from "./mode.js";
import type { ThemeColors } from "./types.js";
declare const __propDef: {
    props: {
        trueNonce?: string | undefined;
        initConfig: Parameters<typeof setInitialMode>[0];
        themeColors?: ThemeColors;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ModeWatcherFullProps = typeof __propDef.props;
export type ModeWatcherFullEvents = typeof __propDef.events;
export type ModeWatcherFullSlots = typeof __propDef.slots;
export default class ModeWatcherFull extends SvelteComponent<ModeWatcherFullProps, ModeWatcherFullEvents, ModeWatcherFullSlots> {
}
export {};
