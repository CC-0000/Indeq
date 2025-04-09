import { createSelect } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getPositioningUpdater } from "../floating/helpers.js";
import { createBitAttrs, generateId, getOptionUpdater, removeUndefined, } from "../../internal/index.js";
function getSelectData() {
    const NAME = "select";
    const GROUP_NAME = "select-group";
    const ITEM_NAME = "select-item";
    const PARTS = [
        "arrow",
        "content",
        "group",
        "item",
        "indicator",
        "input",
        "label",
        "trigger",
        "value",
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
    const select = {
        ...createSelect({ ...removeUndefined(props), forceVisible: true }),
        getAttrs,
    };
    setContext(NAME, select);
    return {
        ...select,
        updateOption: getOptionUpdater(select.options),
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
    const select = getCtx();
    setContext(ITEM_NAME, value);
    return select;
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
    const select = getCtx();
    select.options.arrowSize?.set(size);
    return select;
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
