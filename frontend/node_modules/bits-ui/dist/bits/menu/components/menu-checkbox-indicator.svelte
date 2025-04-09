<script>import { getCheckboxIndicator, getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const checked = getCheckboxIndicator();
const { getAttrs } = getCtx();
const attrs = getAttrs("checkbox-indicator");
</script>

{#if asChild}
	<slot {attrs} checked={$checked} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		{#if $checked}
			<slot {attrs} checked={$checked} />
		{/if}
	</div>
{/if}
