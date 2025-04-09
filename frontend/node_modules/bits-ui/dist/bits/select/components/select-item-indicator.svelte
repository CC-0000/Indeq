<script>import { getItemIndicator } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const { isSelected, value, getAttrs } = getItemIndicator();
const attrs = getAttrs("indicator");
</script>

{#if asChild}
	<slot {attrs} isSelected={$isSelected(value)} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		{#if $isSelected(value)}
			<slot {attrs} isSelected={$isSelected(value)} />
		{/if}
	</div>
{/if}
