<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const {
  elements: { field },
  states: { segmentContents },
  ids,
  getAttrs
} = getCtx();
$: if (id) {
  ids.field.field.set(id);
}
const attrs = getAttrs("input");
$: builder = $field;
$: Object.assign(builder, attrs);
$: segments = {
  start: $segmentContents.start,
  end: $segmentContents.end
};
</script>

{#if asChild}
	<slot {builder} {segments} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} {segments} />
	</div>
{/if}
