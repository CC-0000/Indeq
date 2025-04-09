import type { ModalConfig } from './types.js';
export declare const useModal: <Node_1 extends HTMLElement>(node: Node_1, config: ModalConfig) => {
    update: (config: ModalConfig) => void;
    destroy(): void;
};
