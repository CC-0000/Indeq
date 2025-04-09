<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { description },
  ids,
  getAttrs
} = getCtx();
const attrs = getAttrs("description");
$: if (id) {
  ids.description.set(id);
}
$: builder = $description;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
