import { createToggle } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getToggleData() {
    const NAME = "toggle";
    const PARTS = ["root", "input"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getToggleData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const toggle = { ...createToggle(removeUndefined(props)), getAttrs };
    setContext(NAME, toggle);
    return {
        ...toggle,
        updateOption: getOptionUpdater(toggle.options),
    };
}
export function getCtx() {
    const { NAME } = getToggleData();
    return getContext(NAME);
}
