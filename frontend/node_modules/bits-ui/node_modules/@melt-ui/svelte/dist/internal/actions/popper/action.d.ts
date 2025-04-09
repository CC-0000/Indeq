import { noop } from '../../helpers/index.js';
import type { PopperArgs } from './types.js';
export declare const usePopper: <Node_1 extends HTMLElement>(popperElement: Node_1, args: PopperArgs) => {
    destroy: typeof noop;
};
