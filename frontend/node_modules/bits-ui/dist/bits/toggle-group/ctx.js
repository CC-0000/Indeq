import { createToggleGroup } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getToggleGroupData() {
    const NAME = "toggle-group";
    const PARTS = ["root", "item"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getToggleGroupData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const toggleGroup = { ...createToggleGroup(removeUndefined(props)), getAttrs };
    setContext(NAME, toggleGroup);
    return {
        ...toggleGroup,
        updateOption: getOptionUpdater(toggleGroup.options),
    };
}
export function getCtx() {
    const { NAME } = getToggleGroupData();
    return getContext(NAME);
}
