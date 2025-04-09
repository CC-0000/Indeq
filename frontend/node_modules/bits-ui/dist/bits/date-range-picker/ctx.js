import { createDateRangePicker } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
import { getCalendarData } from "../calendar/ctx.js";
import { getDateFieldData } from "../date-field/ctx.js";
import { getPopoverData } from "../popover/ctx.js";
import { getPositioningUpdater } from "../floating/helpers.js";
function getDateRangePickerData() {
    const NAME = "date-range-picker";
    return {
        NAME,
    };
}
export function setCtx(props) {
    const { NAME } = getDateRangePickerData();
    const { NAME: CALENDAR_NAME, PARTS: CALENDAR_PARTS } = getCalendarData();
    const getCalendarAttrs = createBitAttrs(CALENDAR_NAME, CALENDAR_PARTS);
    const { NAME: FIELD_NAME, PARTS: FIELD_PARTS } = getDateFieldData();
    const getFieldAttrs = createBitAttrs(FIELD_NAME, FIELD_PARTS);
    const { NAME: POPOVER_NAME, PARTS: POPOVER_PARTS } = getPopoverData();
    const getPopoverAttrs = createBitAttrs(POPOVER_NAME, POPOVER_PARTS);
    const dateRangePicker = {
        ...createDateRangePicker({ ...removeUndefined(props), forceVisible: true }),
        getCalendarAttrs,
        getFieldAttrs,
        getPopoverAttrs,
    };
    const updateOption = getOptionUpdater(dateRangePicker.options);
    setContext(NAME, { ...dateRangePicker, updateOption });
    return {
        ...dateRangePicker,
        updateOption,
    };
}
export function getCtx() {
    const { NAME } = getDateRangePickerData();
    return getContext(NAME);
}
export function updatePositioning(props) {
    const defaultPlacement = {
        side: "bottom",
        align: "center",
    };
    const withDefaults = { ...defaultPlacement, ...props };
    const { options: { positioning }, } = getCtx();
    const updater = getPositioningUpdater(positioning);
    updater(withDefaults);
}
