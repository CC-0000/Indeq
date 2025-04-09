import { type CreateMenubarMenuProps, type CreateMenubarSubmenuProps, type CreateMenubarProps as MenubarProps } from "@melt-ui/svelte";
import type { Writable } from "svelte/store";
import type { FloatingProps } from "../floating/_types.js";
type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
type GetMenuReturn = Omit<ReturnType<typeof setMenuCtx>, "updateOption">;
type GetSubmenuReturn = Omit<ReturnType<typeof setSubMenuCtx>, "updateOption">;
export declare function setCtx(props: MenubarProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "label" | "radio-group" | "separator" | "content" | "item" | "trigger" | "group" | "arrow" | "checkbox-indicator" | "checkbox-item" | "radio-item" | "sub-content" | "sub-trigger") => Record<string, string> | undefined;
    getMenubarAttrs: (part: string) => Record<string, string> | undefined;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        menubar: string;
    }>;
    elements: {
        menubar: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => {
            destroy?: undefined;
        } | {
            destroy: typeof import("@melt-ui/svelte/internal/helpers").noop;
        }, ([$menubarId]: [string]) => {
            role: string;
            "data-melt-menubar": string;
            "data-orientation": string;
            id: string;
        }, string>;
    };
    builders: {
        createMenu: (props?: CreateMenubarMenuProps) => {
            ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
                menu: string;
                trigger: string;
            }>;
            elements: {
                menu: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/menubar/events.js").MenubarEvents["menu"]>, ([$isVisible, $portal, $menuId, $triggerId, $menubarId]: [boolean, string | HTMLElement | null | undefined, string, string, string]) => {
                    readonly role: "menu";
                    readonly hidden: true | undefined;
                    readonly style: string;
                    readonly id: string;
                    readonly "aria-labelledby": string;
                    readonly "data-state": "open" | "closed";
                    readonly "data-melt-scope": string;
                    readonly "data-portal": "" | undefined;
                    readonly tabindex: -1;
                }, string>;
                trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/menubar/events.js").MenubarEvents["trigger"]>, ([$rootOpen, $menuId, $triggerId]: [boolean, string, string]) => {
                    readonly "aria-controls": string;
                    readonly "aria-expanded": boolean;
                    readonly "data-state": "open" | "closed";
                    readonly id: string;
                    readonly "aria-haspopup": "menu";
                    readonly "data-orientation": "horizontal";
                    readonly role: "menuitem";
                }, string>;
                overlay: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>], <Node_1 extends any>(node: HTMLElement) => {
                    destroy(): void;
                }, ([$isVisible]: [boolean]) => {
                    readonly hidden: true | undefined;
                    readonly tabindex: -1;
                    readonly style: string;
                    readonly "aria-hidden": "true";
                    readonly "data-state": "open" | "closed";
                }, string>;
                item: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, () => {
                    role: string;
                    tabindex: number;
                    "data-orientation": string;
                }, string>;
                group: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
                    role: string;
                    "aria-labelledby": string;
                }, string>;
                groupLabel: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
                    id: string;
                }, string>;
                arrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number | undefined>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number | undefined) => {
                    "data-arrow": boolean;
                    style: string;
                }, string>;
                separator: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$orientation, $decorative]: [import("@melt-ui/svelte/internal/types").Orientation, boolean]) => {
                    role: string;
                    "aria-orientation": "vertical" | undefined;
                    "aria-hidden": boolean;
                    "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
                }, "separator">;
            };
            builders: {
                createCheckboxItem: (props?: import("@melt-ui/svelte/dist/builders/menu/types.js")._CheckboxItemProps | undefined) => {
                    elements: {
                        checkboxItem: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
                            update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
                            set: (this: void, value: boolean | "indeterminate") => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
                            get: () => boolean | "indeterminate";
                            destroy?: (() => void) | undefined;
                        }, import("svelte/store").Writable<boolean>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, ([$checked, $disabled]: [boolean | "indeterminate", boolean]) => {
                            readonly role: "menuitemcheckbox";
                            readonly tabindex: -1;
                            readonly "data-orientation": "vertical";
                            readonly "aria-checked": "true" | "mixed" | "false";
                            readonly "data-disabled": true | undefined;
                            readonly "data-state": "indeterminate" | "checked" | "unchecked";
                        }, string>;
                    };
                    states: {
                        checked: {
                            update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
                            set: (this: void, value: boolean | "indeterminate") => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
                            get: () => boolean | "indeterminate";
                            destroy?: (() => void) | undefined;
                        };
                    };
                    helpers: {
                        isChecked: import("svelte/store").Readable<boolean>;
                        isIndeterminate: import("svelte/store").Readable<boolean>;
                    };
                    options: {
                        disabled: import("svelte/store").Writable<boolean>;
                    };
                };
                createSubmenu: (args?: import("@melt-ui/svelte/dist/builders/menu/types.js")._CreateSubmenuProps | undefined) => {
                    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
                        menu: string;
                        trigger: string;
                    }>;
                    elements: {
                        subTrigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
                            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
                            set: (this: void, value: boolean) => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
                            get: () => boolean;
                            destroy?: (() => void) | undefined;
                        }, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerleave" | "pointermove">, ([$subOpen, $disabled, $subMenuId, $subTriggerId]: [boolean, boolean, string, string]) => {
                            readonly role: "menuitem";
                            readonly id: string;
                            readonly tabindex: -1;
                            readonly "aria-controls": string;
                            readonly "aria-expanded": boolean;
                            readonly "data-state": "open" | "closed";
                            readonly "data-disabled": true | undefined;
                            readonly "aria-haspopop": "menu";
                        }, string>;
                        subMenu: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"focusout" | "keydown" | "pointermove">, ([$subIsVisible, $subMenuId, $subTriggerId]: [boolean, string, string]) => {
                            readonly role: "menu";
                            readonly hidden: true | undefined;
                            readonly style: string;
                            readonly id: string;
                            readonly "aria-labelledby": string;
                            readonly "data-state": "open" | "closed";
                            readonly "data-id": string;
                            readonly tabindex: -1;
                        }, string>;
                        subArrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
                            "data-arrow": boolean;
                            style: string;
                        }, string>;
                    };
                    states: {
                        subOpen: {
                            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
                            set: (this: void, value: boolean) => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
                            get: () => boolean;
                            destroy?: (() => void) | undefined;
                        };
                    };
                    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
                        open?: import("svelte/store").Writable<boolean> | undefined;
                        ids?: Partial<{
                            menu: string;
                            trigger: string;
                        }> | undefined;
                        onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
                        positioning: import("@melt-ui/svelte/internal/actions").FloatingConfig | {
                            placement: "right-start";
                            gutter: number;
                        };
                        arrowSize: number;
                        disabled: boolean;
                        preventScroll: true;
                        closeOnEscape: true;
                        closeOnOutsideClick: true;
                        portal: undefined;
                        loop: false;
                        dir: "ltr";
                        defaultOpen: false;
                        typeahead: true;
                        closeOnItemClick: true;
                        onOutsideClick: undefined;
                    }, "ids">>;
                };
                createMenuRadioGroup: (args?: import("@melt-ui/svelte/dist/builders/menu/types.js")._CreateRadioGroupProps) => {
                    elements: {
                        radioGroup: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
                            role: string;
                        }, string>;
                        radioItem: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
                            update: (updater: import("svelte/store").Updater<string | null>, sideEffect?: ((newValue: string | null) => void) | undefined) => void;
                            set: (this: void, value: string | null) => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<string | null>, invalidate?: import("svelte/store").Invalidator<string | null> | undefined): import("svelte/store").Unsubscriber;
                            get: () => string | null;
                            destroy?: (() => void) | undefined;
                        }], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, ([$value]: [string | null]) => (itemProps: import("@melt-ui/svelte/dist/builders/menu/types.js")._RadioItemProps) => {
                            disabled: boolean;
                            role: string;
                            "data-state": string;
                            "aria-checked": boolean;
                            "data-disabled": boolean | undefined;
                            "data-value": string;
                            "data-orientation": string;
                            tabindex: number;
                        }, string>;
                    };
                    states: {
                        value: {
                            update: (updater: import("svelte/store").Updater<string | null>, sideEffect?: ((newValue: string | null) => void) | undefined) => void;
                            set: (this: void, value: string | null) => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<string | null>, invalidate?: import("svelte/store").Invalidator<string | null> | undefined): import("svelte/store").Unsubscriber;
                            get: () => string | null;
                            destroy?: (() => void) | undefined;
                        };
                    };
                    helpers: {
                        isChecked: import("svelte/store").Readable<(itemValue: string) => boolean>;
                    };
                };
            };
            states: {
                open: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
            };
            options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
                dir: import("@melt-ui/svelte/internal/types").TextDirection;
                open?: import("svelte/store").Writable<boolean> | undefined;
                forceVisible: boolean;
                portal: string | HTMLElement | null | undefined;
                ids?: Partial<{
                    menu: string;
                    trigger: string;
                }> | undefined;
                defaultOpen: boolean;
                onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
                positioning: import("@melt-ui/svelte/internal/actions").FloatingConfig | {
                    placement: "bottom-start";
                };
                arrowSize: number;
                loop: boolean;
                closeOnOutsideClick: boolean;
                closeOnEscape: boolean;
                onOutsideClick: ((event: import("@melt-ui/svelte/internal/actions").InteractOutsideEvent) => void) | undefined;
                typeahead: boolean;
                closeOnItemClick: boolean;
                closeFocus: import("@melt-ui/svelte/index.js").FocusProp | undefined;
                disableFocusFirstItem: boolean;
            }>;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        loop: boolean;
        closeOnEscape: boolean;
        preventScroll: boolean;
        ids?: Partial<{
            menubar: string;
        }> | undefined;
    }, "ids">>;
};
export declare function getCtx(): GetReturn;
export declare function setMenuCtx(props: CreateMenubarMenuProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "label" | "radio-group" | "separator" | "content" | "item" | "trigger" | "group" | "arrow" | "checkbox-indicator" | "checkbox-item" | "radio-item" | "sub-content" | "sub-trigger") => Record<string, string> | undefined;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        menu: string;
        trigger: string;
    }>;
    elements: {
        menu: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/menubar/events.js").MenubarEvents["menu"]>, ([$isVisible, $portal, $menuId, $triggerId, $menubarId]: [boolean, string | HTMLElement | null | undefined, string, string, string]) => {
            readonly role: "menu";
            readonly hidden: true | undefined;
            readonly style: string;
            readonly id: string;
            readonly "aria-labelledby": string;
            readonly "data-state": "open" | "closed";
            readonly "data-melt-scope": string;
            readonly "data-portal": "" | undefined;
            readonly tabindex: -1;
        }, string>;
        trigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<import("@melt-ui/svelte/dist/builders/menubar/events.js").MenubarEvents["trigger"]>, ([$rootOpen, $menuId, $triggerId]: [boolean, string, string]) => {
            readonly "aria-controls": string;
            readonly "aria-expanded": boolean;
            readonly "data-state": "open" | "closed";
            readonly id: string;
            readonly "aria-haspopup": "menu";
            readonly "data-orientation": "horizontal";
            readonly role: "menuitem";
        }, string>;
        overlay: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>], <Node_1 extends any>(node: HTMLElement) => {
            destroy(): void;
        }, ([$isVisible]: [boolean]) => {
            readonly hidden: true | undefined;
            readonly tabindex: -1;
            readonly style: string;
            readonly "aria-hidden": "true";
            readonly "data-state": "open" | "closed";
        }, string>;
        item: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, () => {
            role: string;
            tabindex: number;
            "data-orientation": string;
        }, string>;
        group: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            role: string;
            "aria-labelledby": string;
        }, string>;
        groupLabel: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
            id: string;
        }, string>;
        arrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number | undefined>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number | undefined) => {
            "data-arrow": boolean;
            style: string;
        }, string>;
        separator: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("@melt-ui/svelte/internal/types").Orientation>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$orientation, $decorative]: [import("@melt-ui/svelte/internal/types").Orientation, boolean]) => {
            role: string;
            "aria-orientation": "vertical" | undefined;
            "aria-hidden": boolean;
            "data-orientation": import("@melt-ui/svelte/internal/types").Orientation;
        }, "separator">;
    };
    builders: {
        createCheckboxItem: (props?: import("@melt-ui/svelte/dist/builders/menu/types.js")._CheckboxItemProps | undefined) => {
            elements: {
                checkboxItem: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
                    update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
                    set: (this: void, value: boolean | "indeterminate") => void;
                    subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
                    get: () => boolean | "indeterminate";
                    destroy?: (() => void) | undefined;
                }, import("svelte/store").Writable<boolean>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, ([$checked, $disabled]: [boolean | "indeterminate", boolean]) => {
                    readonly role: "menuitemcheckbox";
                    readonly tabindex: -1;
                    readonly "data-orientation": "vertical";
                    readonly "aria-checked": "true" | "mixed" | "false";
                    readonly "data-disabled": true | undefined;
                    readonly "data-state": "indeterminate" | "checked" | "unchecked";
                }, string>;
            };
            states: {
                checked: {
                    update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
                    set: (this: void, value: boolean | "indeterminate") => void;
                    subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
                    get: () => boolean | "indeterminate";
                    destroy?: (() => void) | undefined;
                };
            };
            helpers: {
                isChecked: import("svelte/store").Readable<boolean>;
                isIndeterminate: import("svelte/store").Readable<boolean>;
            };
            options: {
                disabled: import("svelte/store").Writable<boolean>;
            };
        };
        createSubmenu: (args?: import("@melt-ui/svelte/dist/builders/menu/types.js")._CreateSubmenuProps | undefined) => {
            ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
                menu: string;
                trigger: string;
            }>;
            elements: {
                subTrigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
                    update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
                    set: (this: void, value: boolean) => void;
                    subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
                    get: () => boolean;
                    destroy?: (() => void) | undefined;
                }, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerleave" | "pointermove">, ([$subOpen, $disabled, $subMenuId, $subTriggerId]: [boolean, boolean, string, string]) => {
                    readonly role: "menuitem";
                    readonly id: string;
                    readonly tabindex: -1;
                    readonly "aria-controls": string;
                    readonly "aria-expanded": boolean;
                    readonly "data-state": "open" | "closed";
                    readonly "data-disabled": true | undefined;
                    readonly "aria-haspopop": "menu";
                }, string>;
                subMenu: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"focusout" | "keydown" | "pointermove">, ([$subIsVisible, $subMenuId, $subTriggerId]: [boolean, string, string]) => {
                    readonly role: "menu";
                    readonly hidden: true | undefined;
                    readonly style: string;
                    readonly id: string;
                    readonly "aria-labelledby": string;
                    readonly "data-state": "open" | "closed";
                    readonly "data-id": string;
                    readonly tabindex: -1;
                }, string>;
                subArrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
                    "data-arrow": boolean;
                    style: string;
                }, string>;
            };
            states: {
                subOpen: {
                    update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
                    set: (this: void, value: boolean) => void;
                    subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
                    get: () => boolean;
                    destroy?: (() => void) | undefined;
                };
            };
            options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
                open?: import("svelte/store").Writable<boolean> | undefined;
                ids?: Partial<{
                    menu: string;
                    trigger: string;
                }> | undefined;
                onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
                positioning: import("@melt-ui/svelte/internal/actions").FloatingConfig | {
                    placement: "right-start";
                    gutter: number;
                };
                arrowSize: number;
                disabled: boolean;
                preventScroll: true;
                closeOnEscape: true;
                closeOnOutsideClick: true;
                portal: undefined;
                loop: false;
                dir: "ltr";
                defaultOpen: false;
                typeahead: true;
                closeOnItemClick: true;
                onOutsideClick: undefined;
            }, "ids">>;
        };
        createMenuRadioGroup: (args?: import("@melt-ui/svelte/dist/builders/menu/types.js")._CreateRadioGroupProps) => {
            elements: {
                radioGroup: import("@melt-ui/svelte/internal/helpers").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
                    role: string;
                }, string>;
                radioItem: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
                    update: (updater: import("svelte/store").Updater<string | null>, sideEffect?: ((newValue: string | null) => void) | undefined) => void;
                    set: (this: void, value: string | null) => void;
                    subscribe(this: void, run: import("svelte/store").Subscriber<string | null>, invalidate?: import("svelte/store").Invalidator<string | null> | undefined): import("svelte/store").Unsubscriber;
                    get: () => string | null;
                    destroy?: (() => void) | undefined;
                }], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, ([$value]: [string | null]) => (itemProps: import("@melt-ui/svelte/dist/builders/menu/types.js")._RadioItemProps) => {
                    disabled: boolean;
                    role: string;
                    "data-state": string;
                    "aria-checked": boolean;
                    "data-disabled": boolean | undefined;
                    "data-value": string;
                    "data-orientation": string;
                    tabindex: number;
                }, string>;
            };
            states: {
                value: {
                    update: (updater: import("svelte/store").Updater<string | null>, sideEffect?: ((newValue: string | null) => void) | undefined) => void;
                    set: (this: void, value: string | null) => void;
                    subscribe(this: void, run: import("svelte/store").Subscriber<string | null>, invalidate?: import("svelte/store").Invalidator<string | null> | undefined): import("svelte/store").Unsubscriber;
                    get: () => string | null;
                    destroy?: (() => void) | undefined;
                };
            };
            helpers: {
                isChecked: import("svelte/store").Readable<(itemValue: string) => boolean>;
            };
        };
    };
    states: {
        open: import("@melt-ui/svelte/internal/helpers").WithGet<import("svelte/store").Writable<boolean>>;
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        dir: import("@melt-ui/svelte/internal/types").TextDirection;
        open?: import("svelte/store").Writable<boolean> | undefined;
        forceVisible: boolean;
        portal: string | HTMLElement | null | undefined;
        ids?: Partial<{
            menu: string;
            trigger: string;
        }> | undefined;
        defaultOpen: boolean;
        onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
        positioning: import("@melt-ui/svelte/internal/actions").FloatingConfig | {
            placement: "bottom-start";
        };
        arrowSize: number;
        loop: boolean;
        closeOnOutsideClick: boolean;
        closeOnEscape: boolean;
        onOutsideClick: ((event: import("@melt-ui/svelte/internal/actions").InteractOutsideEvent) => void) | undefined;
        typeahead: boolean;
        closeOnItemClick: boolean;
        closeFocus: import("@melt-ui/svelte/index.js").FocusProp | undefined;
        disableFocusFirstItem: boolean;
    }>;
};
export declare function getMenuCtx(): GetMenuReturn;
export declare function setSubMenuCtx(props: CreateMenubarSubmenuProps): {
    updateOption: <K extends string, V extends import("svelte/store").StoresValues<Writable<unknown>>>(key: K, value: V | undefined) => void;
    getAttrs: (part: "label" | "radio-group" | "separator" | "content" | "item" | "trigger" | "group" | "arrow" | "checkbox-indicator" | "checkbox-item" | "radio-item" | "sub-content" | "sub-trigger") => Record<string, string> | undefined;
    ids: import("@melt-ui/svelte/internal/helpers").ToWritableStores<{
        menu: string;
        trigger: string;
    }>;
    elements: {
        subTrigger: import("@melt-ui/svelte/internal/helpers").MeltElement<[{
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        }, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerleave" | "pointermove">, ([$subOpen, $disabled, $subMenuId, $subTriggerId]: [boolean, boolean, string, string]) => {
            readonly role: "menuitem";
            readonly id: string;
            readonly tabindex: -1;
            readonly "aria-controls": string;
            readonly "aria-expanded": boolean;
            readonly "data-state": "open" | "closed";
            readonly "data-disabled": true | undefined;
            readonly "aria-haspopop": "menu";
        }, string>;
        subMenu: import("@melt-ui/svelte/internal/helpers").MeltElement<[import("svelte/store").Readable<boolean>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => import("@melt-ui/svelte/internal/types").MeltActionReturn<"focusout" | "keydown" | "pointermove">, ([$subIsVisible, $subMenuId, $subTriggerId]: [boolean, string, string]) => {
            readonly role: "menu";
            readonly hidden: true | undefined;
            readonly style: string;
            readonly id: string;
            readonly "aria-labelledby": string;
            readonly "data-state": "open" | "closed";
            readonly "data-id": string;
            readonly tabindex: -1;
        }, string>;
        subArrow: import("@melt-ui/svelte/internal/helpers").MeltElement<import("@melt-ui/svelte/dist/internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
            "data-arrow": boolean;
            style: string;
        }, string>;
    };
    states: {
        subOpen: {
            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
            set: (this: void, value: boolean) => void;
            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
            get: () => boolean;
            destroy?: (() => void) | undefined;
        };
    };
    options: import("@melt-ui/svelte/internal/helpers").ToWritableStores<Omit<{
        open?: import("svelte/store").Writable<boolean> | undefined;
        ids?: Partial<{
            menu: string;
            trigger: string;
        }> | undefined;
        onOpenChange?: import("@melt-ui/svelte/internal/helpers").ChangeFn<boolean> | undefined;
        positioning: import("@melt-ui/svelte/internal/actions").FloatingConfig | {
            placement: "right-start";
            gutter: number;
        };
        arrowSize: number;
        disabled: boolean;
        preventScroll: true;
        closeOnEscape: true;
        closeOnOutsideClick: true;
        portal: undefined;
        loop: false;
        dir: "ltr";
        defaultOpen: false;
        typeahead: true;
        closeOnItemClick: true;
        onOutsideClick: undefined;
    }, "ids">>;
};
export declare function getSubMenuCtx(): GetSubmenuReturn;
export declare function updatePositioning(props: FloatingProps): void;
export declare function updateSubPositioning(props: FloatingProps): void;
export {};
