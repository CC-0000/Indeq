import { createSwitch } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getSwitchData() {
    const NAME = "switch";
    const PARTS = ["root", "input", "thumb"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getSwitchData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const Switch = { ...createSwitch(removeUndefined(props)), getAttrs };
    setContext(NAME, Switch);
    return {
        ...Switch,
        updateOption: getOptionUpdater(Switch.options),
    };
}
export function getCtx() {
    const { NAME } = getSwitchData();
    return getContext(NAME);
}
