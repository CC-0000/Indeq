export declare function disabledAttr(disabled: boolean | undefined): true | undefined;
export declare const hiddenInputAttrs: {
    type: string;
    'aria-hidden': boolean;
    hidden: boolean;
    tabIndex: number;
    style: string;
};
/**
 * @param portal The value of the `portal` option store.
 * @returns the value of the `data-portal` attribute.
 */
export declare function portalAttr(portal: string | HTMLElement | null | undefined): "" | undefined;
