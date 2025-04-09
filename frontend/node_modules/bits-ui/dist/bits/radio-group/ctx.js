import { createRadioGroup } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getRadioGroupData() {
    const NAME = "radio-group";
    const ITEM_NAME = "radio-group-item";
    const PARTS = ["root", "item", "input", "item-indicator"];
    return {
        NAME,
        ITEM_NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getRadioGroupData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const radioGroup = { ...createRadioGroup(removeUndefined(props)), getAttrs };
    setContext(NAME, radioGroup);
    return {
        ...radioGroup,
        updateOption: getOptionUpdater(radioGroup.options),
    };
}
export function getCtx() {
    const { NAME } = getRadioGroupData();
    return getContext(NAME);
}
export function setItemCtx(value) {
    const { ITEM_NAME } = getRadioGroupData();
    const radioGroup = { ...getCtx(), value };
    setContext(ITEM_NAME, radioGroup);
    return radioGroup;
}
export function getRadioIndicator() {
    const { ITEM_NAME } = getRadioGroupData();
    return getContext(ITEM_NAME);
}
