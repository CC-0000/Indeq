import { createDateRangeField } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getDateFieldData } from "../date-field/ctx.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function setCtx(props) {
    const { NAME, PARTS } = getDateFieldData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const dateRangeField = { ...createDateRangeField(removeUndefined(props)), getAttrs };
    setContext(NAME, dateRangeField);
    return {
        ...dateRangeField,
        updateOption: getOptionUpdater(dateRangeField.options),
    };
}
export function getCtx() {
    const { NAME } = getDateFieldData();
    return getContext(NAME);
}
