import { SvelteComponent } from "svelte";
declare class __sveltets_Render<T, Multiple extends boolean = false> {
    props(): {
        disabled?: boolean | undefined;
        portal?: (HTMLElement | string | null) | undefined;
        preventScroll?: boolean | undefined;
        closeOnEscape?: boolean | undefined;
        closeOnOutsideClick?: boolean | undefined;
        onOutsideClick?: ((event: import("@melt-ui/svelte/index.js").InteractOutsideEvent) => void) | undefined;
        name?: string | undefined;
        required?: boolean | undefined;
        typeahead?: boolean | undefined;
        scrollAlignment?: ("nearest" | "center") | undefined;
        loop?: boolean | undefined;
        highlightOnHover?: boolean | undefined;
        selected?: ([Multiple] extends [true] ? import("../../../index.js").Selected<T>[] | undefined : [Multiple] extends [false] ? import("../../../index.js").Selected<T> | undefined : import("../../../index.js").Selected<T> | import("../../../index.js").Selected<T>[] | undefined) | undefined;
        onSelectedChange?: import("../../../internal/types.js").OnChangeFn<[Multiple] extends [true] ? import("../../../index.js").Selected<T>[] | undefined : [Multiple] extends [false] ? import("../../../index.js").Selected<T> | undefined : import("../../../index.js").Selected<T> | import("../../../index.js").Selected<T>[] | undefined> | undefined;
        open?: boolean | undefined;
        onOpenChange?: import("../../../internal/types.js").OnChangeFn<boolean> | undefined;
        multiple?: Multiple | undefined;
        items?: import("../../../index.js").Selected<T>[] | undefined;
    };
    events(): {} & {
        [evt: string]: CustomEvent<any>;
    };
    slots(): {
        default: {
            ids: {
                menu: string;
                trigger: string;
                label: string;
            };
        };
    };
}
export type SelectProps<T, Multiple extends boolean = false> = ReturnType<__sveltets_Render<T, Multiple>['props']>;
export type SelectEvents<T, Multiple extends boolean = false> = ReturnType<__sveltets_Render<T, Multiple>['events']>;
export type SelectSlots<T, Multiple extends boolean = false> = ReturnType<__sveltets_Render<T, Multiple>['slots']>;
export default class Select<T, Multiple extends boolean = false> extends SvelteComponent<SelectProps<T, Multiple>, SelectEvents<T, Multiple>, SelectSlots<T, Multiple>> {
}
export {};
