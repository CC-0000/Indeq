<script>import { builderActions, getAttrs } from "../../../helpers/index.js";
export let href = void 0;
export let type = void 0;
export let builders = [];
export let el = void 0;
const attrs = {
  "data-button-root": ""
};
</script>

{#if builders && builders.length}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<svelte:element
		this={href ? "a" : "button"}
		bind:this={el}
		type={href ? undefined : type}
		{href}
		on:click
		on:change
		on:keydown
		on:keyup
		on:mouseenter
		on:mouseleave
		on:mousedown
		on:pointerdown
		on:mouseup
		on:pointerup
		tabindex="0"
		use:builderActions={{ builders }}
		{...getAttrs(builders)}
		{...$$restProps}
		{...attrs}
	>
		<slot />
	</svelte:element>
{:else}
	<!-- svelte-ignore a11y-no-static-element-interactions a11y_no_static_element_interactions -->
	<svelte:element
		this={href ? "a" : "button"}
		bind:this={el}
		type={href ? undefined : type}
		{href}
		on:click
		on:change
		on:keydown
		on:keyup
		on:mouseenter
		on:mouseleave
		on:mousedown
		on:pointerdown
		on:mouseup
		on:pointerup
		tabindex="0"
		{...$$restProps}
		{...attrs}
	>
		<slot />
	</svelte:element>
{/if}
