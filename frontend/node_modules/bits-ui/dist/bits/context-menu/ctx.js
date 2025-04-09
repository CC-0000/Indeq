import { createContextMenu } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
import { getPositioningUpdater } from "../floating/helpers.js";
export function getContextMenuData() {
    const NAME = "menu";
    const PARTS = [
        "arrow",
        "checkbox-indicator",
        "checkbox-item",
        "content",
        "group",
        "item",
        "label",
        "radio-group",
        "radio-item",
        "separator",
        "sub-content",
        "sub-trigger",
        "trigger",
    ];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getContextMenuData();
    const getAttrs = createBitAttrs("menu", PARTS);
    const contextMenu = { ...createContextMenu(removeUndefined(props)), getAttrs };
    setContext(NAME, contextMenu);
    return {
        ...contextMenu,
        updateOption: getOptionUpdater(contextMenu.options),
    };
}
export function getCtx() {
    const { NAME } = getContextMenuData();
    return getContext(NAME);
}
export function updatePositioning(props) {
    const defaultPlacement = {
        side: "bottom",
        align: "start",
    };
    const withDefaults = { ...defaultPlacement, ...props };
    const { options: { positioning }, } = getCtx();
    const updater = getPositioningUpdater(positioning);
    updater(withDefaults);
}
