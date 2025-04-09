<script>import { melt } from "@melt-ui/svelte";
import { getCtx } from "../ctx.js";
export let transition = void 0;
export let transitionConfig = void 0;
export let inTransition = void 0;
export let inTransitionConfig = void 0;
export let outTransition = void 0;
export let outTransitionConfig = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { overlay },
  states: { open },
  getAttrs
} = getCtx();
const attrs = getAttrs("overlay");
$: builder = $overlay;
$: Object.assign(builder, attrs);
</script>

{#if asChild && $open}
	<slot {builder} />
{:else if transition && $open}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<div
		on:mouseup
		bind:this={el}
		transition:transition={transitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
	></div>
{:else if inTransition && outTransition && $open}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		on:mouseup
		{...$$restProps}
	></div>
{:else if inTransition && $open}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		{...builder} use:builder.action
		on:mouseup
		{...$$restProps}
	></div>
{:else if outTransition && $open}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<div
		bind:this={el}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		on:mouseup
		{...$$restProps}
	></div>
{:else if $open}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<div bind:this={el} {...builder} use:builder.action on:mouseup {...$$restProps}></div>
{/if}
