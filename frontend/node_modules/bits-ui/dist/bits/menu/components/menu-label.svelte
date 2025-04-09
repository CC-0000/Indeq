<script>import { melt } from "@melt-ui/svelte";
import { getGroupLabel } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { groupLabel, id, getAttrs } = getGroupLabel();
const attrs = getAttrs("label");
$: builder = $groupLabel(id);
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
