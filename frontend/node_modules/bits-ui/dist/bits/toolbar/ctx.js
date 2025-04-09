import { createToolbar, } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getToolbarData() {
    const NAME = "toolbar";
    const GROUP_NAME = "toolbar-group";
    const PARTS = ["root", "button", "link", "group", "group-item"];
    return {
        NAME,
        GROUP_NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getToolbarData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const toolbar = { ...createToolbar(removeUndefined(props)), getAttrs };
    setContext(NAME, toolbar);
    return {
        ...toolbar,
        updateOption: getOptionUpdater(toolbar.options),
    };
}
export function setGroupCtx(props) {
    const { builders: { createToolbarGroup }, getAttrs, } = getCtx();
    const group = { ...createToolbarGroup(removeUndefined(props)), getAttrs };
    const { GROUP_NAME } = getToolbarData();
    setContext(GROUP_NAME, group);
    return {
        ...group,
        updateOption: getOptionUpdater(group.options),
    };
}
export function getCtx() {
    const { NAME } = getToolbarData();
    return getContext(NAME);
}
export function getGroupCtx() {
    const { GROUP_NAME } = getToolbarData();
    return getContext(GROUP_NAME);
}
