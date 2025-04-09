import { SvelteComponent } from "svelte";
import type { ThemeColors } from "./types.js";
declare const __propDef: {
    props: {
        themeColors?: ThemeColors;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ModeWatcherLiteProps = typeof __propDef.props;
export type ModeWatcherLiteEvents = typeof __propDef.events;
export type ModeWatcherLiteSlots = typeof __propDef.slots;
export default class ModeWatcherLite extends SvelteComponent<ModeWatcherLiteProps, ModeWatcherLiteEvents, ModeWatcherLiteSlots> {
}
export {};
