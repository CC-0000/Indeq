import type { Action } from 'svelte/action';
import { type Readable, type Stores, type StoresValues } from 'svelte/store';
export declare function getElementByMeltId(id: string): HTMLElement | null;
export declare const hiddenAction: <T extends Record<string, unknown>>(obj: T) => T;
type ElementCallback<S extends Stores | undefined> = S extends Stores ? (values: StoresValues<S>) => Record<string, any> | ((...args: any[]) => Record<string, any>) : () => Record<string, any> | ((...args: any[]) => Record<string, any>);
type MeltElementStore<S extends Stores | undefined, A extends Action<any, any>, R extends ElementCallback<S>, Name extends string> = Readable<ReturnType<R> extends infer F extends (...args: any) => any ? ((...args: Parameters<F>) => ReturnType<F> & {
    [K in `data-melt-${Name}`]: '';
} & {
    action: A;
}) & {
    action: A;
} : ReturnType<R> & {
    [K in `data-melt-${Name}`]: '';
} & {
    action: A;
}>;
type MakeElementArgs<S extends Stores | undefined, A extends Action<any, any>, R extends ElementCallback<S>> = {
    stores?: S;
    action?: A;
    returned?: R;
};
export type MeltElement<S extends Stores | undefined, A extends Action<any, any>, R extends ElementCallback<S>, Name extends string> = MeltElementStore<S, A, R, Name> & A;
export type AnyMeltElement = MeltElement<Stores, Action, ElementCallback<Stores>, string>;
export declare const emptyMeltElement: MeltElement<Stores | undefined, Action<any, any, Record<never, any>>, (() => Record<string, any> | ((...args: any[]) => Record<string, any>)) | ((values: any) => Record<string, any> | ((...args: any[]) => Record<string, any>)) | ((values: any[]) => Record<string, any> | ((...args: any[]) => Record<string, any>)) | ((values: [any, ...any[]]) => Record<string, any> | ((...args: any[]) => Record<string, any>)), "empty">;
export declare function makeElement<S extends Stores | undefined, A extends Action<any, any>, R extends ElementCallback<S>, Name extends string>(name: Name, args?: MakeElementArgs<S, A, R>): MeltElement<S, A, R, Name>;
type ElementArrayStore<A extends Action<any, any>, R extends object[], Name extends string> = Readable<{
    [K in keyof R]: R[K] & {
        [K in `data-melt-${Name}`]: '';
    } & {
        action: A;
    };
}>;
type BuilderArrayArgs<S extends Stores, A extends Action<any, any>, R extends object[]> = {
    stores: S;
    returned: (values: StoresValues<S>) => R;
    action?: A;
};
export type ExplicitMakeElementArrayReturn<A extends Action<any, any>, R extends object[], Name extends string> = ElementArrayStore<A, R, Name> & A;
export declare function makeElementArray<S extends Stores, A extends Action<any, any>, R extends object[], Name extends string>(name: Name, args: BuilderArrayArgs<S, A, R>): ExplicitMakeElementArrayReturn<A, R, Name>;
export declare function createElHelpers<Part extends string = string>(prefix: string): {
    name: (part?: Part) => string;
    attribute: (part?: Part) => string;
    selector: (part?: Part) => string;
    getEl: (part?: Part) => Element | null;
};
export {};
