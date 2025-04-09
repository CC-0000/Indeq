import type { HTMLLabelAttributes } from "svelte/elements";
import type { CustomEventHandler } from "../../index.js";
import type { DOMElement } from "../../internal/types.js";
export type LabelPropsWithoutHTML = DOMElement<HTMLLabelElement>;
export type LabelProps = LabelPropsWithoutHTML & HTMLLabelAttributes;
export type LabelEvents<T extends Element = HTMLLabelElement> = {
    mousedown: CustomEventHandler<MouseEvent, T>;
};
