<script>

    export let company = "Fill";
    export let isIntegrated = false;
    //import {Button} from "$lib/components/ui/button/index.js";
    //import { toast } from "svelte-sonner";


    function authenticate() {
        window.location.href = `/profile?provider=${company.toUpperCase()}`;
    }

    function getLogo() {
        switch(company.toUpperCase()) {
            case 'GOOGLE':
            return '/google.svg';
            case 'MICROSOFT':
            return '/microsoft.svg';
            case 'NOTION':
            return '/notion.svg';
            default:
            return '/favicon.png';
        }
    }
</script>

<button on:click={authenticate} class={company.toUpperCase()}>
    <img src={getLogo()} alt="{company} logo" class="logo">
    <span class="company-name">
        {#if isIntegrated}
            Connected to {company}
        {:else}
            Login with {company}
        {/if}
    </span>
    {#if isIntegrated}
        <span class="check-mark">✓</span>
    {:else}
        <span class="plus-mark">+</span>
    {/if}
</button>

<!-- {#if company === 'NOTION'}
    <Button variant="outline" on:click={() => toast.loading('In development...')}>
        <img src={getLogo()} alt={`${company} logo`} class="mr-2 h-6 w-6">
        <span class="company-name">
            {#if isIntegrated}
                Connected to {company}
            {:else}
                Connect with {company}
            {/if}
        </span>
    </Button>
{:else}
    <Button variant="outline" on:click={authenticate}>
        <img src={getLogo()} alt="{company} logo" class="mr-2 h-6 w-6">
        <span class="company-name">
            {#if isIntegrated}
                Connected to {company}
            {:else}
                Connect with {company}
            {/if}
        </span>
    </Button>
{/if} -->
