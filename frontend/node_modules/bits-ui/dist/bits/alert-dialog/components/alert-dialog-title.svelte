<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let level = "h2";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { title },
  ids,
  getAttrs
} = getCtx();
const attrs = getAttrs("title");
$: if (id) {
  ids.title.set(id);
}
$: builder = $title;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<svelte:element this={level} bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</svelte:element>
{/if}
