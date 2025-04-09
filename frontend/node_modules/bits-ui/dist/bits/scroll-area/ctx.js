import { createScrollArea } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getScrollAreaData() {
    const NAME = "scroll-area";
    const SCROLLBAR_NAME = "scrollbar";
    const PARTS = [
        "scrollbar-x",
        "scrollbar-y",
        "thumb-x",
        "thumb-y",
        "viewport",
        "content",
        "root",
        "corner",
    ];
    return { NAME, PARTS, SCROLLBAR_NAME };
}
export function setCtx(props) {
    const { NAME, PARTS } = getScrollAreaData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const scrollArea = { ...createScrollArea(removeUndefined(props)), getAttrs };
    setContext(NAME, scrollArea);
    return {
        ...scrollArea,
        updateOption: getOptionUpdater(scrollArea.options),
    };
}
export function getCtx() {
    const { NAME } = getScrollAreaData();
    return getContext(NAME);
}
export function setScrollbarOrientation(orientation) {
    const { SCROLLBAR_NAME } = getScrollAreaData();
    return setContext(SCROLLBAR_NAME, orientation);
}
export function getScrollbarOrientation() {
    const { SCROLLBAR_NAME } = getScrollAreaData();
    return getContext(SCROLLBAR_NAME);
}
