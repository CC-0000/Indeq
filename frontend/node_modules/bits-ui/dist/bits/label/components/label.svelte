<script>import { createLabel, melt } from "@melt-ui/svelte";
import { getLabelData } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { root }
} = createLabel();
const dispatch = createDispatcher();
const { getAttrs } = getLabelData();
const attrs = getAttrs("root");
$: builder = $root;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<label bind:this={el} {...builder} use:builder.action {...$$restProps} on:m-mousedown={dispatch}>
		<slot {builder} />
	</label>
{/if}
