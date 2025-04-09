export const bits = [
    "accordion",
    "alert-dialog",
    "aspect-ratio",
    "avatar",
    "button",
    "calendar",
    "checkbox",
    "collapsible",
    "combobox",
    "context-menu",
    "date-field",
    "date-picker",
    "date-range-field",
    "date-range-picker",
    "dialog",
    "dropdown-menu",
    "label",
    "link-preview",
    "menubar",
    "pagination",
    "pin-input",
    "popover",
    "progress",
    "radio-group",
    "range-calendar",
    "scroll-area",
    "select",
    "separator",
    "slider",
    "switch",
    "tabs",
    "toggle",
    "toggle-group",
    "toolbar",
    "tooltip",
];
export function createBitAttrs(bit, parts) {
    const attrs = {};
    parts.forEach((part) => {
        attrs[part] = {
            [`data-${bit}-${part}`]: "",
        };
    });
    return (part) => attrs[part];
}
export function disabledAttrs(disabled) {
    return disabled
        ? { "aria-disabled": "true", "data-disabled": "" }
        : { "aria-disabled": undefined, "data-disabled": undefined };
}
