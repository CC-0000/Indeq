<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let orientation = "horizontal";
export let decorative = true;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  updateOption,
  getAttrs
} = setCtx({ orientation, decorative });
const attrs = getAttrs("root");
$: updateOption("orientation", orientation);
$: updateOption("decorative", decorative);
$: builder = $root;
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}></div>
{/if}
