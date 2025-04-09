import { createSlider } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
function getSliderData() {
    const NAME = "slider";
    const PARTS = ["root", "input", "range", "thumb", "tick"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getSliderData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const slider = { ...createSlider(removeUndefined(props)), getAttrs };
    setContext(NAME, slider);
    return {
        ...slider,
        updateOption: getOptionUpdater(slider.options),
    };
}
export function getCtx() {
    const { NAME } = getSliderData();
    return getContext(NAME);
}
