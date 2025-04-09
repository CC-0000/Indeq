import { createPinInput } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getPinInputData() {
    const NAME = "pin-input";
    const PARTS = ["root", "input", "hidden-input"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getPinInputData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const pinInput = { ...createPinInput(removeUndefined(props)), getAttrs };
    setContext(NAME, pinInput);
    return {
        ...pinInput,
        updateOption: getOptionUpdater(pinInput.options),
    };
}
export function getCtx() {
    const { NAME } = getPinInputData();
    return getContext(NAME);
}
