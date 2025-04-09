import { createTabs } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getTabsData() {
    const NAME = "tabs";
    const PARTS = ["root", "content", "list", "trigger"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getTabsData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const tabs = { ...createTabs(removeUndefined(props)), getAttrs };
    setContext(NAME, tabs);
    return {
        ...tabs,
        updateOption: getOptionUpdater(tabs.options),
    };
}
export function getCtx() {
    const { NAME } = getTabsData();
    return getContext(NAME);
}
