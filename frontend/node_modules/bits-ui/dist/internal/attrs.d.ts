export declare const bits: readonly ["accordion", "alert-dialog", "aspect-ratio", "avatar", "button", "calendar", "checkbox", "collapsible", "combobox", "context-menu", "date-field", "date-picker", "date-range-field", "date-range-picker", "dialog", "dropdown-menu", "label", "link-preview", "menubar", "pagination", "pin-input", "popover", "progress", "radio-group", "range-calendar", "scroll-area", "select", "separator", "slider", "switch", "tabs", "toggle", "toggle-group", "toolbar", "tooltip"];
export declare function createBitAttrs<T extends readonly string[]>(bit: (typeof bits)[number] | "menu", parts: T): (part: T[number]) => Record<string, string> | undefined;
export declare function disabledAttrs(disabled: boolean | undefined | null): {
    "aria-disabled": string;
    "data-disabled": string;
} | {
    "aria-disabled": undefined;
    "data-disabled": undefined;
};
