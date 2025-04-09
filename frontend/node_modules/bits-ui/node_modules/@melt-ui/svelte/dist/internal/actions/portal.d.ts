import { noop } from '../helpers/index.js';
export type PortalConfig = string | HTMLElement | undefined;
export declare const usePortal: <Node_1 extends HTMLElement>(el: Node_1, target?: PortalConfig) => {
    destroy: typeof noop;
    update?: undefined;
} | {
    update: (newTarget: HTMLElement | string | undefined) => Promise<void>;
    destroy: () => void;
};
