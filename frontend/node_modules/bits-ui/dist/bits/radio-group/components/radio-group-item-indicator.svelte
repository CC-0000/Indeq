<script>import { getRadioIndicator } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  helpers: { isChecked },
  value,
  getAttrs
} = getRadioIndicator();
const attrs = getAttrs("item-indicator");
$: checked = $isChecked(value);
</script>

{#if asChild}
	<slot {checked} {attrs} />
{:else}
	<div bind:this={el} {...attrs} {...$$restProps}>
		{#if checked}
			<slot {checked} {attrs} />
		{/if}
	</div>
{/if}
