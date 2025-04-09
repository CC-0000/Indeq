<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = void 0;
export let el = void 0;
const {
  elements: { prevButton },
  getAttrs
} = getCtx();
const attrs = getAttrs("prev-button");
$: builder = $prevButton;
$: Object.assign(builder, attrs);
const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button bind:this={el} {...builder} use:builder.action type="button" {...$$restProps} on:m-click={dispatch}>
		<slot {builder} />
	</button>
{/if}
