import type { EscapeKeydownConfig } from './types.js';
export declare const useEscapeKeydown: <Node_1 extends HTMLElement>(node: Node_1, config?: EscapeKeydownConfig) => {
    update: (config?: EscapeKeydownConfig) => void;
    destroy(): void;
};
