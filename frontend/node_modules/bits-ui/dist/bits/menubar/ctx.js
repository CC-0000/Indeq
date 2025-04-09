import { createMenubar, } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getPositioningUpdater } from "../floating/helpers.js";
import { getSubmenuCtx } from "../menu/ctx.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getMenubarData() {
    const NAME = "menubar";
    const MENU_NAME = "menu";
    const SUB_NAME = "menu-submenu";
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
        MENU_NAME,
        SUB_NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS, MENU_NAME } = getMenubarData();
    const getMenubarAttrs = createBitAttrs(NAME, ["root"]);
    const getAttrs = createBitAttrs(MENU_NAME, PARTS);
    const menubar = { ...createMenubar(removeUndefined(props)), getAttrs, getMenubarAttrs };
    setContext(NAME, menubar);
    return {
        ...menubar,
        updateOption: getOptionUpdater(menubar.options),
    };
}
export function getCtx() {
    const { NAME } = getMenubarData();
    return getContext(NAME);
}
export function setMenuCtx(props) {
    const { MENU_NAME } = getMenubarData();
    const { builders: { createMenu }, getAttrs, } = getCtx();
    const menu = { ...createMenu({ ...removeUndefined(props), forceVisible: false }), getAttrs };
    setContext(MENU_NAME, menu);
    return {
        ...menu,
        updateOption: getOptionUpdater(menu.options),
    };
}
export function getMenuCtx() {
    const { MENU_NAME } = getMenubarData();
    return getContext(MENU_NAME);
}
export function setSubMenuCtx(props) {
    const { SUB_NAME } = getMenubarData();
    const { builders: { createSubmenu }, getAttrs, } = getMenuCtx();
    const sub = { ...createSubmenu(removeUndefined(props)), getAttrs };
    setContext(SUB_NAME, sub);
    return {
        ...sub,
        updateOption: getOptionUpdater(sub.options),
    };
}
export function getSubMenuCtx() {
    const { SUB_NAME } = getMenubarData();
    return getContext(SUB_NAME);
}
const defaultPlacement = {
    side: "bottom",
    align: "center",
};
export function updatePositioning(props) {
    const withDefaults = { ...defaultPlacement, ...props };
    const { options: { positioning }, } = getMenuCtx();
    const updater = getPositioningUpdater(positioning);
    updater(withDefaults);
}
const defaultSubPlacement = {
    side: "right",
    align: "start",
};
export function updateSubPositioning(props) {
    const withDefaults = { ...defaultSubPlacement, ...props };
    const { options: { positioning }, } = getSubmenuCtx();
    const updater = getPositioningUpdater(positioning);
    updater(withDefaults);
}
