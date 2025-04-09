<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let el = void 0;
const {
  elements: { input },
  options: { value, name, disabled, required }
} = getCtx();
$: inputValue = $value === void 0 || $value === "" ? "on" : $value;
</script>

<input
	bind:this={el}
	{...$input} use:$input.action
	name={$name}
	disabled={$disabled}
	required={$required}
	value={inputValue}
	{...$$restProps}
/>
