import { createCombobox } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getPositioningUpdater } from "../floating/helpers.js";
import { createBitAttrs, generateId, getOptionUpdater, removeUndefined, } from "../../internal/index.js";
function getSelectData() {
    const NAME = "combobox";
    const GROUP_NAME = "combobox-group";
    const ITEM_NAME = "combobox-item";
    const PARTS = [
        "content",
        "menu",
        "input",
        "item",
        "label",
        "group",
        "group-label",
        "arrow",
        "hidden-input",
        "indicator",
    ];
    return {
        NAME,
        GROUP_NAME,
        ITEM_NAME,
        PARTS,
    };
}
export function getCtx() {
    const { NAME } = getSelectData();
    return getContext(NAME);
}
export function setCtx(props) {
    const { NAME, PARTS } = getSelectData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const combobox = {
        ...createCombobox({ ...removeUndefined(props), forceVisible: true }),
        getAttrs,
    };
    setContext(NAME, combobox);
    return {
        ...combobox,
        updateOption: getOptionUpdater(combobox.options),
    };
}
export function setGroupCtx() {
    const { GROUP_NAME } = getSelectData();
    const id = generateId();
    setContext(GROUP_NAME, id);
    const { elements: { group }, getAttrs, } = getCtx();
    return { group, id, getAttrs };
}
export function setItemCtx(value) {
    const { ITEM_NAME } = getSelectData();
    const combobox = getCtx();
    setContext(ITEM_NAME, value);
    return combobox;
}
export function getGroupLabel() {
    const { GROUP_NAME } = getSelectData();
    const id = getContext(GROUP_NAME);
    const { elements: { groupLabel }, getAttrs, } = getCtx();
    return { groupLabel, id, getAttrs };
}
export function getItemIndicator() {
    const { ITEM_NAME } = getSelectData();
    const { helpers: { isSelected }, getAttrs, } = getCtx();
    const value = getContext(ITEM_NAME);
    return {
        value,
        isSelected,
        getAttrs,
    };
}
export function setArrow(size = 8) {
    const combobox = getCtx();
    combobox.options.arrowSize?.set(size);
    return combobox;
}
export function updatePositioning(props) {
    const defaultPlacement = {
        side: "bottom",
        align: "center",
        sameWidth: true,
    };
    const withDefaults = { ...defaultPlacement, ...props };
    const { options: { positioning }, } = getCtx();
    const updater = getPositioningUpdater(positioning);
    updater(withDefaults);
}
