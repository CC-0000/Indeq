<script>import { melt } from "@melt-ui/svelte";
import { derived } from "svelte/store";
import { setCtx } from "../ctx.js";
export let loop = true;
export let closeOnEscape = true;
export let asChild = false;
export let id = void 0;
export let preventScroll = void 0;
export let el = void 0;
const {
  elements: { menubar },
  updateOption,
  ids,
  getMenubarAttrs
} = setCtx({ loop, closeOnEscape, preventScroll });
const idValues = derived([ids.menubar], ([$menubarId]) => ({
  menubar: $menubarId
}));
const attrs = getMenubarAttrs("root");
$: if (id) {
  ids.menubar.set(id);
}
$: updateOption("loop", loop);
$: updateOption("closeOnEscape", closeOnEscape);
$: updateOption("preventScroll", preventScroll);
$: builder = $menubar;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} ids={$idValues} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} ids={$idValues} />
	</div>
{/if}
