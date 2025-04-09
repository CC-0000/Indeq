<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let asChild = false;
export let el = void 0;
const {
  elements: { hiddenInput },
  options: { disabled },
  getAttrs
} = getCtx();
$: attrs = {
  ...getAttrs("input"),
  disabled: $disabled ? true : void 0
};
$: builder = $hiddenInput;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<input bind:this={el} {...builder} use:builder.action {...$$restProps} />
{/if}
