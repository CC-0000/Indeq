/// <reference types="svelte" />
import { noop } from '../../internal/helpers/index.js';
import type { MeltActionReturn } from '../../internal/types.js';
import type { MenubarEvents } from './events.js';
import type { CreateMenubarMenuProps, CreateMenubarProps } from './types.js';
export declare const menubarIdParts: readonly ["menubar"];
export type MenubarIdParts = typeof menubarIdParts;
export declare function createMenubar(props?: CreateMenubarProps): {
    ids: import("../../internal/helpers/index.js").ToWritableStores<{
        menubar: string;
    }>;
    elements: {
        menubar: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => {
            destroy?: undefined;
        } | {
            destroy: typeof noop;
        }, ([$menubarId]: [string]) => {
            role: string;
            'data-melt-menubar': string;
            'data-orientation': string;
            id: string;
        }, string>;
    };
    builders: {
        createMenu: (props?: CreateMenubarMenuProps) => {
            ids: import("../../internal/helpers/index.js").ToWritableStores<{
                menu: string;
                trigger: string;
            }>;
            elements: {
                menu: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string | HTMLElement | null | undefined>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<MenubarEvents['menu']>, ([$isVisible, $portal, $menuId, $triggerId, $menubarId]: [boolean, string | HTMLElement | null | undefined, string, string, string]) => {
                    readonly role: "menu";
                    readonly hidden: true | undefined;
                    readonly style: string;
                    readonly id: string;
                    readonly 'aria-labelledby': string;
                    readonly 'data-state': "open" | "closed";
                    readonly 'data-melt-scope': string;
                    readonly 'data-portal': "" | undefined;
                    readonly tabindex: -1;
                }, string>;
                trigger: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<MenubarEvents['trigger']>, ([$rootOpen, $menuId, $triggerId]: [boolean, string, string]) => {
                    readonly 'aria-controls': string;
                    readonly 'aria-expanded': boolean;
                    readonly 'data-state': "open" | "closed";
                    readonly id: string;
                    readonly 'aria-haspopup': "menu";
                    readonly 'data-orientation': "horizontal";
                    readonly role: "menuitem";
                }, string>;
                overlay: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>], <Node_1 extends any>(node: HTMLElement) => {
                    destroy(): void;
                }, ([$isVisible]: [boolean]) => {
                    readonly hidden: true | undefined;
                    readonly tabindex: -1;
                    readonly style: string;
                    readonly 'aria-hidden': "true";
                    readonly 'data-state': "open" | "closed";
                }, string>;
                item: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, (node: HTMLElement) => MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, () => {
                    role: string;
                    tabindex: number;
                    'data-orientation': string;
                }, string>;
                group: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
                    role: string;
                    'aria-labelledby': string;
                }, string>;
                groupLabel: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => (groupId: string) => {
                    id: string;
                }, string>;
                arrow: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number | undefined>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number | undefined) => {
                    'data-arrow': boolean;
                    style: string;
                }, string>;
                separator: import("../../internal/helpers/index.js").MeltElement<[import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<import("../../internal/types.js").Orientation>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>], import("svelte/action").Action<any, any, Record<never, any>>, ([$orientation, $decorative]: [import("../../internal/types.js").Orientation, boolean]) => {
                    role: string;
                    'aria-orientation': "vertical" | undefined;
                    'aria-hidden': boolean;
                    'data-orientation': import("../../internal/types.js").Orientation;
                }, "separator">;
            };
            builders: {
                createCheckboxItem: (props?: import("../menu/types.js")._CheckboxItemProps | undefined) => {
                    elements: {
                        checkboxItem: import("../../internal/helpers/index.js").MeltElement<[{
                            update: (updater: import("svelte/store").Updater<boolean | "indeterminate">, sideEffect?: ((newValue: boolean | "indeterminate") => void) | undefined) => void;
                            set: (this: void, value: boolean | "indeterminate") => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<boolean | "indeterminate">, invalidate?: import("svelte/store").Invalidator<boolean | "indeterminate"> | undefined): import("svelte/store").Unsubscriber;
                            get: () => boolean | "indeterminate";
                            destroy?: (() => void) | undefined;
                        }, import("svelte/store").Writable<boolean>], (node: HTMLElement) => MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, ([$checked, $disabled]: [boolean | "indeterminate", boolean]) => {
                            readonly role: "menuitemcheckbox";
                            readonly tabindex: -1;
                            readonly 'data-orientation': "vertical";
                            readonly 'aria-checked': "true" | "mixed" | "false";
                            readonly 'data-disabled': true | undefined;
                            readonly 'data-state': "indeterminate" | "checked" | "unchecked";
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
                createSubmenu: (args?: import("../menu/types.js")._CreateSubmenuProps | undefined) => {
                    ids: import("../../internal/helpers/index.js").ToWritableStores<{
                        menu: string;
                        trigger: string;
                    }>;
                    elements: {
                        subTrigger: import("../../internal/helpers/index.js").MeltElement<[{
                            update: (updater: import("svelte/store").Updater<boolean>, sideEffect?: ((newValue: boolean) => void) | undefined) => void;
                            set: (this: void, value: boolean) => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<boolean>, invalidate?: import("svelte/store").Invalidator<boolean> | undefined): import("svelte/store").Unsubscriber;
                            get: () => boolean;
                            destroy?: (() => void) | undefined;
                        }, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerleave" | "pointermove">, ([$subOpen, $disabled, $subMenuId, $subTriggerId]: [boolean, boolean, string, string]) => {
                            readonly role: "menuitem";
                            readonly id: string;
                            readonly tabindex: -1;
                            readonly 'aria-controls': string;
                            readonly 'aria-expanded': boolean;
                            readonly 'data-state': "open" | "closed";
                            readonly 'data-disabled': true | undefined;
                            readonly 'aria-haspopop': "menu";
                        }, string>;
                        subMenu: import("../../internal/helpers/index.js").MeltElement<[import("svelte/store").Readable<boolean>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>, import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<string>>], (node: HTMLElement) => MeltActionReturn<"focusout" | "keydown" | "pointermove">, ([$subIsVisible, $subMenuId, $subTriggerId]: [boolean, string, string]) => {
                            readonly role: "menu";
                            readonly hidden: true | undefined;
                            readonly style: string;
                            readonly id: string;
                            readonly 'aria-labelledby': string;
                            readonly 'data-state': "open" | "closed";
                            readonly 'data-id': string;
                            readonly tabindex: -1;
                        }, string>;
                        subArrow: import("../../internal/helpers/index.js").MeltElement<import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<number>>, import("svelte/action").Action<any, any, Record<never, any>>, ($arrowSize: number) => {
                            'data-arrow': boolean;
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
                    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
                        open?: import("svelte/store").Writable<boolean> | undefined;
                        ids?: Partial<{
                            menu: string;
                            trigger: string;
                        }> | undefined;
                        onOpenChange?: import("../../internal/helpers/index.js").ChangeFn<boolean> | undefined;
                        positioning: import("../../internal/actions/index.js").FloatingConfig | {
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
                createMenuRadioGroup: (args?: import("../menu/types.js")._CreateRadioGroupProps) => {
                    elements: {
                        radioGroup: import("../../internal/helpers/index.js").MeltElement<import("svelte/store").Stores | undefined, import("svelte/action").Action<any, any, Record<never, any>>, () => {
                            role: string;
                        }, string>;
                        radioItem: import("../../internal/helpers/index.js").MeltElement<[{
                            update: (updater: import("svelte/store").Updater<string | null>, sideEffect?: ((newValue: string | null) => void) | undefined) => void;
                            set: (this: void, value: string | null) => void;
                            subscribe(this: void, run: import("svelte/store").Subscriber<string | null>, invalidate?: import("svelte/store").Invalidator<string | null> | undefined): import("svelte/store").Unsubscriber;
                            get: () => string | null;
                            destroy?: (() => void) | undefined;
                        }], (node: HTMLElement) => MeltActionReturn<"click" | "focusin" | "focusout" | "keydown" | "pointerdown" | "pointerleave" | "pointermove">, ([$value]: [string | null]) => (itemProps: import("../menu/types.js")._RadioItemProps) => {
                            disabled: boolean;
                            role: string;
                            'data-state': string;
                            'aria-checked': boolean;
                            'data-disabled': boolean | undefined;
                            'data-value': string;
                            'data-orientation': string;
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
                open: import("../../internal/helpers/withGet.js").WithGet<import("svelte/store").Writable<boolean>>;
            };
            options: import("../../internal/helpers/index.js").ToWritableStores<{
                dir: import("../../internal/types.js").TextDirection;
                open?: import("svelte/store").Writable<boolean> | undefined;
                forceVisible: boolean;
                portal: string | HTMLElement | null | undefined;
                ids?: Partial<{
                    menu: string;
                    trigger: string;
                }> | undefined;
                defaultOpen: boolean;
                onOpenChange?: import("../../internal/helpers/index.js").ChangeFn<boolean> | undefined;
                positioning: import("../../internal/actions/index.js").FloatingConfig | {
                    placement: "bottom-start";
                };
                arrowSize: number;
                loop: boolean;
                closeOnOutsideClick: boolean;
                closeOnEscape: boolean;
                onOutsideClick: ((event: import("../../internal/actions/index.js").InteractOutsideEvent) => void) | undefined;
                typeahead: boolean;
                closeOnItemClick: boolean;
                closeFocus: import("../../internal/helpers/index.js").FocusProp | undefined;
                disableFocusFirstItem: boolean;
            }>;
        };
    };
    options: import("../../internal/helpers/index.js").ToWritableStores<Omit<{
        loop: boolean;
        closeOnEscape: boolean;
        preventScroll: boolean;
        ids?: Partial<{
            menubar: string;
        }> | undefined;
    }, "ids">>;
};
