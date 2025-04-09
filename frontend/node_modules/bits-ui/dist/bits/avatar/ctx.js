import { createAvatar } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "../../internal/index.js";
export function getAvatarData() {
    const NAME = "avatar";
    const PARTS = ["root", "image", "fallback"];
    return {
        NAME,
        PARTS,
    };
}
export function setCtx(props) {
    const { NAME, PARTS } = getAvatarData();
    const getAttrs = createBitAttrs(NAME, PARTS);
    const avatar = { ...createAvatar(removeUndefined(props)), getAttrs };
    setContext(NAME, avatar);
    return {
        ...avatar,
        updateOption: getOptionUpdater(avatar.options),
    };
}
export function getImage(src = "") {
    const { NAME } = getAvatarData();
    const avatar = getContext(NAME);
    if (!src) {
        avatar.options.src.set("");
    }
    else {
        avatar.options.src.set(src);
    }
    return avatar;
}
export function getCtx() {
    const { NAME } = getAvatarData();
    return getContext(NAME);
}
