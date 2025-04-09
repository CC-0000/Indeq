<script>import { getRadioIndicator } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  helpers: { isChecked },
  value,
  getAttrs
} = getRadioIndicator();
const attrs = getAttrs("radio-indicator");
$: checked = $isChecked(value);
</script>

{#if asChild}
	<slot {attrs} {checked} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		{#if checked}
			<slot {attrs} {checked} />
		{/if}
	</div>
{/if}
