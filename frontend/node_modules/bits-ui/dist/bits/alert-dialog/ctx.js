import { createDialog } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getAlertDialogData() {
    const NAME = "alert-dialog";
    const PARTS = [
        "action",
        "cancel",
        "content",
        "description",
        "overlay",
        "portal",
        "title",
        "trigger",
    ];
    return { NAME, PARTS };
}
export function setCtx(props) {
    const { NAME, PARTS } = getAlertDialogData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const initAlertDialog = createDialog({
        ...removeUndefined(props),
        role: "alertdialog",
        forceVisible: true,
    });
    const alertDialog = {
        ...initAlertDialog,
        getAttrs,
        updateOption: getOptionUpdater(initAlertDialog.options),
    };
    setContext(NAME, alertDialog);
    return {
        ...alertDialog,
        updateOption: getOptionUpdater(alertDialog.options),
        getAttrs,
    };
}
export function getCtx() {
    const { NAME } = getAlertDialogData();
    return getContext(NAME);
}
