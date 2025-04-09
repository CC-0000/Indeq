<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
import { styleToString } from "../../../internal/style.js";
export let type = "hover";
export let dir = "ltr";
export let hideDelay = 600;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  updateOption,
  getAttrs
} = setCtx({
  type,
  dir,
  hideDelay
});
$: builder = $root;
$: updateOption("type", type);
$: updateOption("dir", dir);
$: updateOption("hideDelay", hideDelay);
const bitsAttrs = getAttrs("root");
const style = styleToString({
  overflow: "hidden"
});
$: attrs = {
  ...$$restProps,
  ...bitsAttrs,
  style
};
$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...attrs}>
		<slot {builder} />
	</div>
{/if}
