import { createTooltip } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getPositioningUpdater } from "../floating/helpers.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getTooltipData() {
    const NAME = "tooltip";
    const PARTS = ["arrow", "content", "trigger"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getTooltipData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const tooltip = {
        ...createTooltip({
            positioning: {
                placement: "top",
                gutter: 0,
            },
            openDelay: 700,
            ...removeUndefined(props),
            forceVisible: true,
        }),
        getAttrs,
    };
    setContext(NAME, tooltip);
    return {
        ...tooltip,
        updateOption: getOptionUpdater(tooltip.options),
    };
}
export function getCtx() {
    const { NAME } = getTooltipData();
    return getContext(NAME);
}
export function setArrow(size = 8) {
    const tooltip = getCtx();
    tooltip.options.arrowSize.set(size);
    return tooltip;
}
export function updatePositioning(props) {
    const defaultPlacement = {
        side: "top",
        align: "center",
        sideOffset: 1,
    };
    const withDefaults = { ...defaultPlacement, ...props };
    const { options: { positioning }, } = getCtx();
    const updater = getPositioningUpdater(positioning);
    updater({ ...withDefaults });
}
