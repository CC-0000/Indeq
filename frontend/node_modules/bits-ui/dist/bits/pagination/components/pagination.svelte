<script>import { melt } from "@melt-ui/svelte";
import { setCtx } from "../ctx.js";
export let count;
export let page = void 0;
export let onPageChange = void 0;
export let perPage = void 0;
export let siblingCount = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { root },
  states: { pages, range, page: localPage },
  getAttrs,
  updateOption
} = setCtx({
  count,
  perPage,
  siblingCount,
  defaultPage: page,
  onPageChange: ({ next }) => {
    if (page !== next) {
      page = next;
      onPageChange?.(next);
    }
    return next;
  }
});
$: page !== void 0 && localPage.set(page);
const attrs = getAttrs("root");
$: builder = $root;
$: Object.assign(builder, attrs);
$: updateOption("count", count);
$: updateOption("perPage", perPage);
$: updateOption("siblingCount", siblingCount);
</script>

{#if asChild}
	<slot {builder} pages={$pages} range={$range} />
{:else}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} pages={$pages} range={$range} />
	</div>
{/if}
