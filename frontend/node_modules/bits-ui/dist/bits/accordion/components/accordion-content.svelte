<script>import { melt } from "@melt-ui/svelte";
import { getContent } from "../ctx.js";
export let transition = void 0;
export let transitionConfig = void 0;
export let inTransition = void 0;
export let inTransitionConfig = void 0;
export let outTransition = void 0;
export let outTransitionConfig = void 0;
export let asChild = false;
export let el = void 0;
const {
  elements: { content },
  helpers: { isSelected },
  propsStore,
  getAttrs
} = getContent();
const attrs = getAttrs("content");
$: builder = $content({ ...$propsStore });
$: Object.assign(builder, attrs);
</script>

{#if asChild && $isSelected($propsStore.value)}
	<slot {builder} />
{:else if transition && $isSelected($propsStore.value)}
	<div
		bind:this={el}
		transition:transition={transitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && outTransition && $isSelected($propsStore.value)}
	<div
		bind:this={el}
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...builder} use:builder.action
		{...$$restProps}
	>
		<slot {builder} />
	</div>
{:else if inTransition && $isSelected($propsStore.value)}
	<div bind:this={el} in:inTransition={inTransitionConfig} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{:else if outTransition && $isSelected($propsStore.value)}
	<div bind:this={el} out:outTransition={outTransitionConfig} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{:else if $isSelected($propsStore.value)}
	<div bind:this={el} {...builder} use:builder.action {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
