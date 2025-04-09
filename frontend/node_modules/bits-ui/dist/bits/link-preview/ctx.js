import { createLinkPreview } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getPositioningUpdater } from "../floating/helpers.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getLinkPreviewData() {
    const NAME = "link-preview";
    const PARTS = ["arrow", "content", "trigger"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getLinkPreviewData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const linkPreview = {
        ...createLinkPreview({
            ...removeUndefined(props),
            forceVisible: true,
        }),
        getAttrs,
    };
    setContext(NAME, linkPreview);
    return {
        ...linkPreview,
        updateOption: getOptionUpdater(linkPreview.options),
    };
}
export function getCtx() {
    const { NAME } = getLinkPreviewData();
    return getContext(NAME);
}
export function setArrow(size = 8) {
    const linkPreview = getCtx();
    linkPreview.options.arrowSize.set(size);
    return linkPreview;
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
