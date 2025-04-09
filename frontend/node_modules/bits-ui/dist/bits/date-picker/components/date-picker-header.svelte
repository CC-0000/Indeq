<script>import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { getCalendarAttrs } = getCtx();
const attrs = getCalendarAttrs("header");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<header bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</header>
{/if}
