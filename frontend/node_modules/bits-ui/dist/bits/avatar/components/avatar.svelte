<script>import { setCtx } from "../ctx.js";
export let delayMs = void 0;
export let loadingStatus = void 0;
export let onLoadingStatusChange = void 0;
export let asChild = false;
export let el = void 0;
const {
  states: { loadingStatus: localLoadingStatus },
  updateOption,
  getAttrs
} = setCtx({
  src: "",
  delayMs,
  onLoadingStatusChange: ({ next }) => {
    loadingStatus = next;
    onLoadingStatusChange?.(next);
    return next;
  }
});
const attrs = getAttrs("root");
$: loadingStatus !== void 0 && localLoadingStatus.set(loadingStatus);
$: updateOption("delayMs", delayMs);
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</div>
{/if}
