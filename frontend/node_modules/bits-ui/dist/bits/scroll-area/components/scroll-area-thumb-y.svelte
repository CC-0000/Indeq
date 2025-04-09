<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { thumbY },
  getAttrs
} = getCtx();
const bitsAttrs = getAttrs("thumb-y");
$: attrs = {
  ...$$restProps,
  ...bitsAttrs
};
$: builder = $thumbY;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div {...builder} use:builder.action bind:this={el}>
		<slot {builder} />
	</div>
{/if}
