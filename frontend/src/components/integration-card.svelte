<script>
    export let company = "Fill";
    export let isIntegrated = false;
    import {Button} from "$lib/components/ui/button/index.js";
    import { toast } from "svelte-sonner";
    function authenticate() {
        window.location.href = `/profile/integration?provider=${company.toUpperCase()}`;
    }
</script>

{#if company === 'NOTION'}
    <Button variant = "outline" on:click={() => toast.loading('In development...')}>
                <span class="company-name">
            {#if isIntegrated}
                Connected
            {:else}
                Connect
            {/if}
        </span>
    </Button>
{:else}
    <Button variant ="outline" on:click={authenticate}>
        <span class="company-name">
            {#if isIntegrated}
                Connected
            {:else}
                Connect
            {/if}
        </span>
    </Button>
{/if}