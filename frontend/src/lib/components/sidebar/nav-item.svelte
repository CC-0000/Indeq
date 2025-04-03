<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Tooltip from "$lib/components/ui/tooltip";
  import { page } from "$app/stores";
  
  export let item: {
    label: string;
    url: string;
    icon: any;
  };
  export let expanded = true;

  $: isActive = $page.url.pathname === item.url;
</script>

{#if expanded}
  <Button
    href={item.url}
    variant={isActive ? "link" : "ghost"}
    class="w-full justify-start gap-2"
    aria-label={item.label}
  >
    <svelte:component this={item.icon} class="size-5"/>
    <span class="font-sm">{item.label}</span>
  </Button>
{:else}
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <Button
        href={item.url}
        variant={isActive ? "link" : "ghost"}
        size="default"
        class="rounded-lg"
        aria-label={item.label}
        builders={[builder]}
      >
        <svelte:component this={item.icon} class="size-6" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content side="right" sideOffset={5}>{item.label}</Tooltip.Content>
  </Tooltip.Root>
{/if} 