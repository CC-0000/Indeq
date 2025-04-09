<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
export let tick;
const { getAttrs } = getCtx();
const attrs = getAttrs("tick");
$: builder = tick;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span bind:this={el} {...builder} use:builder.action {...$$restProps}></span>
{/if}
