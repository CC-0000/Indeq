<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { separator },
  getAttrs
} = getCtx();
const attrs = getAttrs("separator");
$: builder = $separator;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...$separator} use:$separator.action {...$$restProps}></div>
{/if}
