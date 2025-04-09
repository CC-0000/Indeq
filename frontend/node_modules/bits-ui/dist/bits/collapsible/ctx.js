import { createCollapsible } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getCollapsibleData() {
    const NAME = "collapsible";
    const PARTS = ["root", "content", "trigger"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getCollapsibleData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const collapsible = { ...createCollapsible(removeUndefined(props)), getAttrs };
    setContext(NAME, collapsible);
    return {
        ...collapsible,
        updateOption: getOptionUpdater(collapsible.options),
    };
}
export function getCtx() {
    const { NAME } = getCollapsibleData();
    return getContext(NAME);
}
