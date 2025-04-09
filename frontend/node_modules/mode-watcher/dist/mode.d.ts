import { derivedMode, derivedTheme, disableTransitions, modeStorageKey, systemPrefersMode, themeColors, themeStorageKey, userPrefersMode } from "./stores.js";
import type { Mode, ThemeColors } from "./types.js";
/** Toggle between light and dark mode */
export declare function toggleMode(): void;
/** Set the mode to light or dark */
export declare function setMode(mode: Mode): void;
/** Reset the mode to operating system preference */
export declare function resetMode(): void;
/** Set the theme to a custom value */
export declare function setTheme(theme: string): void;
export declare function defineConfig(config: SetInitialModeArgs): SetInitialModeArgs;
type SetInitialModeArgs = {
    defaultMode?: Mode;
    themeColors?: ThemeColors;
    darkClassNames?: string[];
    lightClassNames?: string[];
    defaultTheme?: string;
    modeStorageKey?: string;
    themeStorageKey?: string;
};
/** Used to set the mode on initial page load to prevent FOUC */
export declare function setInitialMode({ defaultMode, themeColors, darkClassNames, lightClassNames, defaultTheme, modeStorageKey, themeStorageKey, }: SetInitialModeArgs): void;
/**
 * A type-safe way to generate the source expression used to set the initial mode and avoid FOUC.
 */
export declare function generateSetInitialModeExpression(config?: SetInitialModeArgs): string;
export { modeStorageKey, themeStorageKey, derivedTheme as theme, userPrefersMode, systemPrefersMode, derivedMode as mode, themeColors, disableTransitions, };
