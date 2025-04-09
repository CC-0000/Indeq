<script>import { melt } from "@melt-ui/svelte";
import { setArrow } from "../ctx.js";
export let asChild = false;
export let el = void 0;
export let size = 8;
const {
  elements: { arrow },
  getAttrs
} = setArrow(size);
const attrs = getAttrs("arrow");
$: builder = $arrow;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}></div>
{/if}
