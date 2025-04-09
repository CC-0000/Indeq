<script>import { onMount } from "svelte";
import {
  defineConfig,
  disableTransitions as disableTransitionsStore,
  mode,
  setMode,
  setTheme,
  systemPrefersMode,
  theme,
  themeColors as themeColorsStore
} from "./mode.js";
import {
  darkClassNames as darkClassNamesStore,
  isValidMode,
  lightClassNames as lightClassNamesStore,
  modeStorageKey as modeStorageKeyStore,
  themeStorageKey as themeStorageKeyStore
} from "./stores.js";
import ModeWatcherLite from "./mode-watcher-lite.svelte";
import ModeWatcherFull from "./mode-watcher-full.svelte";
export let track = true;
export let defaultMode = "system";
export let themeColors = void 0;
export let disableTransitions = true;
export let darkClassNames = ["dark"];
export let lightClassNames = [];
export let defaultTheme = "";
export let nonce = "";
export let themeStorageKey = "mode-watcher-theme";
export let modeStorageKey = "mode-watcher-mode";
export let disableHeadScriptInjection = false;
$:
  disableTransitionsStore.set(disableTransitions);
$:
  themeColorsStore.set(themeColors);
$:
  darkClassNamesStore.set(darkClassNames);
$:
  lightClassNamesStore.set(lightClassNames);
$:
  modeStorageKeyStore.set(modeStorageKey);
$:
  themeStorageKeyStore.set(themeStorageKey);
onMount(() => {
  const modeUnsubscribe = mode.subscribe(() => {
  });
  const themeUnsubscribe = theme.subscribe(() => {
  });
  systemPrefersMode.tracking(track);
  systemPrefersMode.query();
  const localStorageMode = localStorage.getItem($modeStorageKeyStore);
  setMode(isValidMode(localStorageMode) ? localStorageMode : defaultMode);
  const localStorageTheme = localStorage.getItem($themeStorageKeyStore);
  setTheme(localStorageTheme || defaultTheme);
  return () => {
    modeUnsubscribe();
    themeUnsubscribe();
  };
});
const initConfig = defineConfig({
  defaultMode,
  themeColors,
  darkClassNames,
  lightClassNames,
  defaultTheme,
  modeStorageKey,
  themeStorageKey
});
$:
  trueNonce = typeof window === "undefined" ? nonce : "";
</script>

{#if disableHeadScriptInjection}
	<ModeWatcherLite {themeColors} />
{:else}
	<ModeWatcherFull {trueNonce} {initConfig} {themeColors} />
{/if}
