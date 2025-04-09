import { createSeparator } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getSeparatorData() {
    const NAME = "separator";
    const PARTS = ["root"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getSeparatorData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const separator = { ...createSeparator(removeUndefined(props)), getAttrs };
    return {
        ...separator,
        updateOption: getOptionUpdater(separator.options),
    };
}
