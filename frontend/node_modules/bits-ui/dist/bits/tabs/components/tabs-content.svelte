<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let value;
export let asChild = false;
export let el = void 0;
const {
  elements: { content },
  getAttrs
} = getCtx();
const attrs = getAttrs("content");
$: builder = $content(value);
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
