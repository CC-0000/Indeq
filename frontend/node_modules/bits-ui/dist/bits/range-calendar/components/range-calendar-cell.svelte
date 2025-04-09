<script>import { getCtx } from "../ctx.js";
export let date;
export let asChild = false;
export let el = void 0;
const {
  helpers: { isDateDisabled, isDateUnavailable },
  getAttrs
} = getCtx();
$: attrs = {
  ...getAttrs("cell"),
  "aria-disabled": $isDateDisabled(date) || $isDateUnavailable(date),
  role: "gridcell"
};
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<td bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</td>
{/if}
