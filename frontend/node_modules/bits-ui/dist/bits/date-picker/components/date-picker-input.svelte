<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { field },
  states: { segmentContents },
  ids,
  getFieldAttrs
} = getCtx();
$: if (id) {
  ids.dateField.field.set(id);
}
const attrs = getFieldAttrs("input");
$: builder = $field;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot builder segments={$segmentContents} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot builder segments={$segmentContents} />
	</div>
{/if}
