<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let id = void 0;
export let part;
export let type;
export let el = void 0;
const {
  elements: { startSegment, endSegment },
  ids,
  getFieldAttrs
} = getCtx();
$: if (id && part !== "literal") {
  if (type === "start") {
    ids.rangeField.start[part].set(id);
  } else {
    ids.rangeField.end[part].set(id);
  }
}
const attrs = getFieldAttrs("segment");
$: builder = type === "start" ? $startSegment(part) : $endSegment(part);
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
