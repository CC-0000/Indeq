import { createProgress } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getProgressData() {
    const NAME = "progress";
    const PARTS = ["root"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getProgressData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const progress = { ...createProgress(removeUndefined(props)), getAttrs };
    return {
        ...progress,
        updateOption: getOptionUpdater(progress.options),
    };
}
