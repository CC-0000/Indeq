import type { Action } from "svelte/action";
export type Builder<Element = any, Param = any, Attributes extends Record<string, any> = Record<string, any>> = Record<string, any> & {
    action: Action<Element, Param, Attributes>;
};
type BuilderActionsParams = {
    builders: Builder<any, any, any>[];
};
type BuilderActionsReturn = {
    destroy: () => void;
};
export declare function builderActions(node: HTMLElement, params: BuilderActionsParams): BuilderActionsReturn;
export declare function getAttrs(builders: Builder<any, any, any>[]): Record<string, unknown>;
export {};
