<script>import { melt } from "@melt-ui/svelte";
import { setGroupCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { group, id, getAttrs } = setGroupCtx();
const attrs = getAttrs("group");
$: builder = $group(id);
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
