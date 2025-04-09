<script>import { melt } from "@melt-ui/svelte";
import { getCtx, getGroupLabel } from "../ctx.js";
export let asChild = false;
export let id = void 0;
export let el = void 0;
const { ids, getAttrs } = getCtx();
const { groupLabel, id: groupId } = getGroupLabel();
const attrs = getAttrs("group-label");
$: if (id) {
  ids.label.set(id);
}
$: builder = $groupLabel(groupId);
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
