import { createCalendar } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getCalendarData() {
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
    const { NAME, PARTS } = getCalendarData();
    const getCalendarAttrs = createBitAttrs(NAME, PARTS);
    const calendar = { ...createCalendar(removeUndefined(props)), getCalendarAttrs };
    setContext(NAME, calendar);
    return {
        ...calendar,
        updateOption: getOptionUpdater(calendar.options),
    };
}
export function getCtx() {
    const { NAME } = getCalendarData();
    const ctx = getContext(NAME);
    return ctx;
}
