import type { InteractOutsideConfig } from './types.js';
export declare const useInteractOutside: <Node_1 extends HTMLElement>(node: Node_1, config: InteractOutsideConfig) => {
    update: (config: InteractOutsideConfig) => void;
    destroy(): void;
};
