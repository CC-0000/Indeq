<script lang="ts">
  import { writable } from 'svelte/store';
  import Integration_Button from '../../../components/integration-card.svelte';
	import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // List of companies and their data
  const integrations = [
    { name: 'Google', logo: '/google.svg', description: 'Connect all of your docs, sheets, slides, drawings, and other files.', company: 'GOOGLE' },
    { name: 'Microsoft', logo: '/microsoft.svg', description: 'Connect all of your Office 365 apps, including Word, Excel, and PowerPoint.', company: 'MICROSOFT' },
    { name: 'Notion', logo: '/notion.svg', description: 'Integrate your notes, tasks, and projects in one place.', company: 'NOTION' },
  ];

  onMount(() => {
    if ($page.data.redirectTo) {
      window.location.href = $page.data.redirectTo;
    }
  });
</script>

<main>
  {#each integrations as integration}
    <div class="card">
      <div class="content">
        <div class="logo-container">
          <img src={integration.logo} alt="{integration.name} Logo" class="logo" />
        </div>
        <div>
          <span class="text-lg font-medium text-gray-900">{integration.name}</span>
          <p class="text-gray-600 text-sm mt-1 leading-relaxed">
            {integration.description}
          </p>
        </div>
      </div>
      <!-- Button is dynamically included here -->
      <Integration_Button company={integration.company} />
    </div>
  {/each}
</main>

<style>
  main {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
  }

  .card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: rgb(243, 244, 246);
    backdrop-filter: blur(10px);
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .logo-container {
    padding: 0.5rem;
    border-radius: 50%;
  }

  .logo {
    height: 50px;
    width: 50px;
  }

  @media (max-width: 768px) {
    main {
      flex-direction: column;
      align-items: center;
    }

    .card {
      flex-direction: column;
      text-align: center;
      height: auto;
    }

    .content {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
