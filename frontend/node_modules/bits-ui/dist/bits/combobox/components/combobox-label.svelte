<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { label },
  getAttrs
} = getCtx();
const attrs = getAttrs("label");
$: builder = $label;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<label bind:this={el} {...builder} use:builder.action {...$$restProps} for={builder.id}>
		<slot />
	</label>
{/if}
