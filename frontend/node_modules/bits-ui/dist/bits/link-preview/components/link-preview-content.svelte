<script>import { melt } from "@melt-ui/svelte";
import { getCtx, updatePositioning } from "../ctx.js";
import { createDispatcher } from "../../../internal/index.js";
export let transition = void 0;
export let transitionConfig = void 0;
export let inTransition = void 0;
export let inTransitionConfig = void 0;
export let outTransition = void 0;
export let outTransitionConfig = void 0;
export let asChild = false;
export let id = void 0;
export let side = "bottom";
export let align = "center";
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
  elements: { content },
  states: { open },
  ids,
  getAttrs
} = getCtx();
$: if (id) {
  ids.content.set(id);
}
const attrs = getAttrs("content");
const dispatch = createDispatcher();
$: builder = $content;
$: Object.assign(builder, attrs);
$: if ($open) {
  updatePositioning({
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
}
</script>

{#if asChild && $open}
	<slot {builder} />
{:else if transition && $open}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{:else if $open}
	<div
		bind:this={el}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-focusout={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
