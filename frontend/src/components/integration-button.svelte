<script>
    export let company = "Fill";
    export let isIntegrated = false;

    function loginToService() {
        switch(company.toLowerCase()) {
            case 'google':
                window.location.href = "http://localhost:8080/google/login";
                break;
            case 'microsoft':
                window.location.href = "http://localhost:8080/microsoft/login";
                break;
            case 'notion':
                window.location.href = "http://localhost:8080/notion/login";
                break;
            default:
                console.error('Unknown service:', company);
        }
    }

    function getLogo() {
        switch(company.toLowerCase()) {
            case 'google':
                return '/google.svg';
            case 'microsoft':
                return '/microsoft.svg';
            case 'notion':
                return '/notion.svg';
            default:
                return '/favicon.png';
        }
    }
</script>

<button on:click={loginToService} class={company.toLowerCase()}>
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

<style>
    button {
        padding: 8px 16px;
        border-radius: 4px;
        border: 1px solid #ddd;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f0f0f0;
        color: black;
        width: 100%;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #e8e8e8;
    }

    .logo {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }

    .company-name {
        flex-grow: 1;
        text-align: center;
    }

    .check-mark {
        color: #4CAF50;
        font-weight: bold;
        margin-left: 8px;
    }

    .plus-mark {
        color: #666;
        font-weight: bold;
        margin-left: 8px;
    }
</style>