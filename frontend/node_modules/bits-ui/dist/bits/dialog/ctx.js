import { createDialog } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getDialogData() {
    const NAME = "dialog";
    const PARTS = [
        "close",
        "content",
        "description",
        "overlay",
        "portal",
        "title",
        "trigger",
    ];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getDialogData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const dialog = {
        ...createDialog({ ...removeUndefined(props), role: "dialog", forceVisible: true }),
        getAttrs,
    };
    setContext(NAME, dialog);
    return {
        ...dialog,
        updateOption: getOptionUpdater(dialog.options),
    };
}
export function getCtx() {
    const { NAME } = getDialogData();
    return getContext(NAME);
}
