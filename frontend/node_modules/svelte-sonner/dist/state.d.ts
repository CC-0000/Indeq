import type { ComponentType } from 'svelte';
import type { HeightT, ExternalToast, PromiseData, PromiseT, ToastT, ToastTypes } from './types.js';
export declare const toastState: {
    create: (data: Omit<ToastT<ComponentType>, "id" | "type" | "title" | "promise" | "updated"> & {
        id?: string | number | undefined;
    } & {
        message?: string | ComponentType | undefined;
        type?: ToastTypes | undefined;
        promise?: PromiseT | undefined;
    }) => string | number;
    addToast: (data: ToastT) => void;
    dismiss: (id?: number | string) => string | number | undefined;
    remove: (id?: number | string) => string | number | undefined;
    message: (message: string | ComponentType, data?: ExternalToast) => string | number;
    error: (message: string | ComponentType, data?: ExternalToast) => string | number;
    success: (message: string | ComponentType, data?: ExternalToast) => string | number;
    info: (message: string | ComponentType, data?: ExternalToast) => string | number;
    warning: (message: string | ComponentType, data?: ExternalToast) => string | number;
    loading: (message: string | ComponentType, data?: ExternalToast) => string | number;
    promise: <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData> | undefined) => string | number | undefined;
    custom: <T extends ComponentType = ComponentType>(component: T, data?: ExternalToast<T> | undefined) => string | number;
    removeHeight: (id: number | string) => void;
    setHeight: (data: HeightT) => void;
    reset: () => void;
    toasts: {
        subscribe: (this: void, run: import("svelte/store").Subscriber<ToastT[]>, invalidate?: import("svelte/store").Invalidator<ToastT[]> | undefined) => import("svelte/store").Unsubscriber;
        set: (value: ToastT[]) => void;
        update: (updater: import("svelte/store").Updater<ToastT[]>) => void;
    };
    heights: {
        subscribe: (this: void, run: import("svelte/store").Subscriber<HeightT[]>, invalidate?: import("svelte/store").Invalidator<HeightT[]> | undefined) => import("svelte/store").Unsubscriber;
        set: (value: HeightT[]) => void;
        update: (updater: import("svelte/store").Updater<HeightT[]>) => void;
    };
};
declare function toastFunction(message: string | ComponentType, data?: ExternalToast): string | number;
export declare const toast: typeof toastFunction & {
    success: (message: string | ComponentType, data?: ExternalToast) => string | number;
    info: (message: string | ComponentType, data?: ExternalToast) => string | number;
    warning: (message: string | ComponentType, data?: ExternalToast) => string | number;
    error: (message: string | ComponentType, data?: ExternalToast) => string | number;
    custom: <T extends ComponentType = ComponentType>(component: T, data?: ExternalToast<T> | undefined) => string | number;
    message: (message: string | ComponentType, data?: ExternalToast) => string | number;
    promise: <ToastData>(promise: PromiseT<ToastData>, data?: PromiseData<ToastData> | undefined) => string | number | undefined;
    dismiss: (id?: number | string) => string | number | undefined;
    loading: (message: string | ComponentType, data?: ExternalToast) => string | number;
};
export declare const useEffect: (subscribe: unknown) => {
    subscribe: unknown;
};
export {};
