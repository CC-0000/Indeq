<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let level = 3;
export let asChild = false;
export let el = void 0;
const {
  elements: { heading: header },
  getAttrs
} = getCtx();
const attrs = getAttrs("header");
$: builder = $header(level);
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
