<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { scrollbarX },
  getAttrs
} = getCtx();
const bitsAttrs = getAttrs("scrollbar-x");
$: attrs = {
  ...$$restProps,
  ...bitsAttrs
};
$: builder = $scrollbarX;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div {...builder} use:builder.action bind:this={el}>
		<slot {builder} />
	</div>
{/if}
