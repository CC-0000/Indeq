import { createDateField } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getDateFieldData() {
    const NAME = "date-field";
    const PARTS = ["label", "input", "segment"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getDateFieldData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const dateField = { ...createDateField(removeUndefined(props)), getAttrs };
    setContext(NAME, dateField);
    return {
        ...dateField,
        updateOption: getOptionUpdater(dateField.options),
    };
}
export function getCtx() {
    const { NAME } = getDateFieldData();
    return getContext(NAME);
}
