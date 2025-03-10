<script lang="ts">
    import { MenuIcon, LogOutIcon, CodesandboxIcon } from 'svelte-feather-icons';
    import * as Avatar from "$lib/components/ui/avatar";
    import * as Popover from "$lib/components/ui/popover";
    import { Button } from "$lib/components/ui/button";
    import { userStore } from '../../stores/userStore';
    import { Routes } from '$lib/config/sidebar-routes';

    //TODO: Will pull from userStore
    $: user = $userStore.user || {
        username: "Guest",
        email: "",
        avatar: ""
    };

</script>
  
<div class="border-t">
    <Popover.Root>
        <Popover.Trigger asChild let:builder>
            <Button
                variant="ghost"
                size="sm"
                class="w-full justify-start gap-2 pb-8 pr-2 pt-8"
                builders={[builder]}
            >
                <Avatar.Root class="h-10 w-10 rounded-lg">
                    <Avatar.Image src={user.avatar} alt={user.username} />
                    <Avatar.Fallback><CodesandboxIcon/></Avatar.Fallback>
                </Avatar.Root>
                <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-sm">{user.username}</span>
                </div>
                <MenuIcon class="ml-auto size-4"/>
            </Button>
        </Popover.Trigger>
        <Popover.Content
            class="w-[var(--radix-popover-trigger-width)] min-w-56 rounded-lg p-2"
            side={"top"}
            sideOffset={0}
        >
            <Button
                href={Routes.profileAccount}
                variant="ghost"
                class="flex items-center justify-start px-0 py-1.5 text-sm space-x-2"         
            >
                <Avatar.Root class="h-8 w-8 rounded-lg">
                    <Avatar.Image src={user.avatar} alt={user.username} />
                    <Avatar.Fallback class="rounded-lg">{user.username[0]}</Avatar.Fallback>
                </Avatar.Root>
                <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-sm">{user.username}</span>
                    <span class="truncate text-xs font-sm">{user.email}</span>
                </div>
            </Button>
            <hr class="my-2" />     
            <Button
                href="/login"
                variant="ghost" 
                class="flex items-center justify-start px-0 py-1.5 text-sm space-x-2"
            >
                <LogOutIcon class="h-4 w-4" />
                <span class="truncate text-xs font-sm">Log Out</span>
            </Button>
        </Popover.Content>
    </Popover.Root>
</div>