<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let loop = true;
export let orientation = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  updateOption,
  getAttrs
} = setCtx({
  loop,
  orientation
});
const attrs = getAttrs("root");
$: updateOption("loop", loop);
$: updateOption("orientation", orientation);
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
