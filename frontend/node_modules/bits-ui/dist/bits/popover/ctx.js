import { createPopover } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
import { getPositioningUpdater } from "../floating/helpers.js";
export function getPopoverData() {
    const NAME = "popover";
    const PARTS = ["arrow", "close", "content", "trigger"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getPopoverData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const popover = {
        ...createPopover({
            positioning: {
                placement: "bottom",
                gutter: 0,
            },
            ...removeUndefined(props),
            forceVisible: true,
        }),
        getAttrs,
    };
    setContext(NAME, popover);
    return {
        ...popover,
        updateOption: getOptionUpdater(popover.options),
    };
}
export function getCtx() {
    const { NAME } = getPopoverData();
    return getContext(NAME);
}
export function setArrow(size = 8) {
    const popover = getCtx();
    popover.options.arrowSize.set(size);
    return popover;
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
