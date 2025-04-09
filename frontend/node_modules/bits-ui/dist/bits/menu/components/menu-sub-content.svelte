<script>import { melt } from "@melt-ui/svelte";
import { getSubmenuCtx, updateSubPositioning } from "../ctx.js";
import { createDispatcher } from "../../../internal/index.js";
export let transition = void 0;
export let transitionConfig = void 0;
export let inTransition = void 0;
export let inTransitionConfig = void 0;
export let outTransition = void 0;
export let outTransitionConfig = void 0;
export let asChild = false;
export let id = void 0;
export let side = "right";
export let align = "start";
export let sideOffset = 0;
export let alignOffset = 0;
export let collisionPadding = 8;
export let avoidCollisions = true;
export let collisionBoundary = void 0;
export let sameWidth = false;
export let fitViewport = false;
export let strategy = "absolute";
export let overlap = false;
export let el = void 0;
const {
  elements: { subMenu },
  states: { subOpen },
  ids,
  getAttrs
} = getSubmenuCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("sub-content");
$: if (id) {
  ids.menu.set(id);
}
$: builder = $subMenu;
$: Object.assign(builder, attrs);
$: updateSubPositioning({
  side,
  align,
  sideOffset,
  alignOffset,
  collisionPadding,
  avoidCollisions,
  collisionBoundary,
  sameWidth,
  fitViewport,
  strategy,
  overlap
});
</script>

{#if asChild && $subOpen}
	<slot {builder} />
{:else if transition && $subOpen}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $subOpen}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $subOpen}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $subOpen}
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{:else if $subOpen}
	<div
		bind:this={el}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
