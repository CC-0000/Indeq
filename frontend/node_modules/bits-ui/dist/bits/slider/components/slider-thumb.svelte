<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
export let asChild = false;
export let el = void 0;
export let thumb;
const { getAttrs } = getCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("thumb");
$: builder = thumb;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span bind:this={el} {...builder} use:builder.action {...$$restProps} on:m-keydown={dispatch}></span>
{/if}
