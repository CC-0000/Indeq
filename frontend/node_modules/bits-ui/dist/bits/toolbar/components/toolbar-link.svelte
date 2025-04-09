<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { link },
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("link");
$: builder = $link;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y-missing-attribute a11y_missing_attribute -->
	<a bind:this={el} {...builder} use:builder.action {...$$restProps} on:click on:m-keydown={dispatch}>
		<slot {builder} />
	</a>
{/if}
