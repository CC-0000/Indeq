<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import {ChevronsLeftIcon, ChevronsRightIcon} from 'svelte-feather-icons';
    import SidebarMain from "./sidebar-main.svelte";
    import SidebarSecondary from "./sidebar-secondary.svelte";
    import SidebarFooter from "$lib/components/sidebar/sidebar-footer.svelte";
    import MenubarNav from "$lib/components/sidebar/sidebar-menu.svelte";
    import { sidebarExpanded, toggleSidebar } from '../../stores/sidbarStore';
</script>

<div class="grid h-screen w-full">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 z-10 hidden md:flex h-full flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        class:w-56={$sidebarExpanded}
        class:w-[70px]={!$sidebarExpanded}>
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-b-grey-200/40">
            <div class="flex items-center gap-2 w-full h-full">
                <a href="/chat" 
                   class="w-full h-full hover:bg-accent/50 hover:text-accent-foreground rounded-md transition-colors flex items-center"
                   aria-label="Home"
                >
                    <div class="flex items-center gap-2 px-1 py-1">
                        <img src="/logo-transparent-large.svg" 
                             alt="Indeq Logo" 
                             class={"h-14 w-14"}
                        />
                        {#if $sidebarExpanded}
                            <span class="text-2xl font-sm">Indeq</span>
                        {/if}
                    </div>
                </a>
            </div>
        </div>
        <!-- Main navigation -->
        <SidebarMain />
        <nav class="absolute right-0 top-0 h-full translate-x-1/2">
            <div class="flex h-full items-center">
                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            variant="ghost" 
                            size="icon"
                            on:click={toggleSidebar}
                            class="rounded-lg bg-background/95 border shadow-sm" 
                            aria-label={$sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                            builders={[builder]}
                        >
                            {#if $sidebarExpanded}
                                <ChevronsLeftIcon class="size-5"/>
                            {:else}
                                <ChevronsRightIcon class="size-5"/>
                            {/if}
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="right" sideOffset={5}>
                        {$sidebarExpanded ? "Collapse" : "Expand"}
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
        </nav>
        <!-- Secondary navigation -->
        <SidebarSecondary/>
        <SidebarFooter/>
    </aside>
    <!--Menubar-->
    <MenubarNav/>
    <!-- Main content -->
    <div class="flex flex-col transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        class:md:pl-56={$sidebarExpanded} 
        class:md:pl-14={!$sidebarExpanded}>
        <div class="flex flex-col transition-all duration-300 pb-16 md:pb-0">
            <slot/>
        </div>
    </div>
</div>
