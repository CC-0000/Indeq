/// <reference types="svelte" />
import type { ActivateOptions, DeactivateOptions, FocusTrap } from 'focus-trap';
import type { FocusTrapConfig } from './types.js';
export declare function createFocusTrap(config?: FocusTrapConfig): {
    useFocusTrap: (node: HTMLElement) => {
        destroy(): void;
    };
    hasFocus: import("svelte/store").Readable<boolean>;
    isPaused: import("svelte/store").Readable<boolean>;
    activate: (opts?: ActivateOptions) => FocusTrap | undefined;
    deactivate: (opts?: DeactivateOptions) => void;
    pause: () => void;
    unpause: () => void;
};
