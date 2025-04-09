import { createPagination } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getPaginationData() {
    const NAME = "pagination";
    const PARTS = ["root", "prev-button", "next-button", "page"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getPaginationData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const pagination = { ...createPagination(removeUndefined(props)), getAttrs };
    setContext(NAME, pagination);
    return {
        ...pagination,
        updateOption: getOptionUpdater(pagination.options),
    };
}
export function getCtx() {
    const { NAME } = getPaginationData();
    return getContext(NAME);
}
