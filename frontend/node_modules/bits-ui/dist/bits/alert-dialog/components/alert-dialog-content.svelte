<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let transition = void 0;
export let transitionConfig = void 0;
export let inTransition = void 0;
export let inTransitionConfig = void 0;
export let outTransition = void 0;
export let outTransitionConfig = void 0;
export let id = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { content },
  states: { open },
  ids,
  getAttrs
} = getCtx();
const attrs = getAttrs("content");
$: if (id) {
  ids.content.set(id);
}
$: builder = $content;
$: Object.assign(builder, attrs);
</script>

{#if asChild && $open}
	<slot {builder} />
{:else if transition && $open}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		{...builder} use:builder.action
		on:pointerdown
		on:pointermove
		on:pointerup
		on:touchcancel
		on:touchend
		on:touchmove|nonpassive
		on:touchstart|nonpassive
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		on:pointerdown
		on:pointermove
		on:pointerup
		on:touchcancel
		on:touchend
		on:touchmove|nonpassive
		on:touchstart|nonpassive
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $open}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		{...builder} use:builder.action
		on:pointerdown
		on:pointermove
		on:pointerup
		on:touchcancel
		on:touchend
		on:touchmove|nonpassive
		on:touchstart|nonpassive
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if outTransition && $open}
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		on:pointerdown
		on:pointermove
		on:pointerup
		on:touchcancel
		on:touchend
		on:touchmove|nonpassive
		on:touchstart|nonpassive
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if $open}
	<div
		bind:this={el}
		{...builder} use:builder.action
		on:pointerdown
		on:pointermove
		on:pointerup
		on:touchcancel
		on:touchend
		on:touchmove|nonpassive
		on:touchstart|nonpassive
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{/if}
