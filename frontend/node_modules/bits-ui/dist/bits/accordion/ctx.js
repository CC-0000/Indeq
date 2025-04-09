import { createAccordion } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getAccordionData() {
    const NAME = "accordion";
    const ITEM_NAME = "accordion-item";
    const PARTS = ["root", "content", "header", "item", "trigger"];
    return { NAME, ITEM_NAME, PARTS };
}
export function setCtx(props) {
    const initAccordion = createAccordion(removeUndefined(props));
    const { NAME, PARTS } = getAccordionData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const accordion = {
        ...initAccordion,
        getAttrs,
        updateOption: getOptionUpdater(initAccordion.options),
    };
    setContext(NAME, accordion);
    return accordion;
}
export function getCtx() {
    const { NAME } = getAccordionData();
    return getContext(NAME);
}
export function setItem(props) {
    const { ITEM_NAME } = getAccordionData();
    const propsStore = writable(props);
    setContext(ITEM_NAME, { propsStore });
    const ctx = getCtx();
    return { ...ctx, propsStore };
}
export function getItemProps() {
    const { ITEM_NAME } = getAccordionData();
    return getContext(ITEM_NAME);
}
export function getContent() {
    const ctx = getCtx();
    const { propsStore } = getItemProps();
    return {
        ...ctx,
        propsStore,
    };
}
export function getTrigger() {
    const ctx = getCtx();
    const { propsStore } = getItemProps();
    return {
        ...ctx,
        props: propsStore,
    };
}
