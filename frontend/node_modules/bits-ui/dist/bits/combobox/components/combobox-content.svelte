<script>import { melt } from "@melt-ui/svelte";
import { getCtx, updatePositioning } from "../ctx.js";
import { createDispatcher } from "../../../internal/events.js";
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
export let sameWidth = true;
export let fitViewport = false;
export let el = void 0;
const {
  elements: { menu },
  states: { open },
  ids,
  getAttrs
} = getCtx();
const dispatch = createDispatcher();
const attrs = getAttrs("content");
$: if (id) {
  ids.menu.set(id);
}
$: builder = $menu;
$: Object.assign(builder, attrs);
$: if ($open)
  updatePositioning({
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    avoidCollisions,
    collisionBoundary,
    sameWidth,
    fitViewport
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
{#if asChild && $open}
	<slot {builder} />
{:else if transition && $open}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-pointerleave={dispatch}
		on:keydown
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
		on:m-pointerleave={dispatch}
		on:keydown
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	<div
		in:inTransition={inTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-pointerleave={dispatch}
		on:keydown
	>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
		on:m-pointerleave={dispatch}
		on:keydown
	>
		<slot {builder} />
	</div>
{:else if $open}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps} on:m-pointerleave={dispatch} on:keydown>
		<slot {builder} />
	</div>
{/if}
