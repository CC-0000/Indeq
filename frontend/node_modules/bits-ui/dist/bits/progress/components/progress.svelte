<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let max = void 0;
export let value = void 0;
export let onValueChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { value: localValue },
  updateOption,
  getAttrs
} = setCtx({
  max,
  defaultValue: value,
  onValueChange: ({ next }) => {
    onValueChange?.(next);
    value = next;
    return next;
  }
});
const attrs = getAttrs("root");
$: value !== void 0 && localValue.set(value);
$: updateOption("max", max);
$: builder = $root;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
