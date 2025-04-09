import { createRangeCalendar } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getRangeCalendarData() {
    const NAME = "calendar";
    const PARTS = [
        "root",
        "prev-button",
        "next-button",
        "heading",
        "grid",
        "day",
        "header",
        "grid-head",
        "head-cell",
        "grid-body",
        "cell",
        "grid-row",
    ];
    return { NAME, PARTS };
}
export function setCtx(props) {
    const { NAME, PARTS } = getRangeCalendarData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const rangeCalendar = { ...createRangeCalendar(removeUndefined(props)), getAttrs };
    setContext(NAME, rangeCalendar);
    return {
        ...rangeCalendar,
        updateOption: getOptionUpdater(rangeCalendar.options),
    };
}
export function getCtx() {
    const { NAME } = getRangeCalendarData();
    return getContext(NAME);
}
