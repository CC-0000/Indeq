<h1>Profile</h1>

<script>
    import Integration_Button from '../../components/integration-button.svelte';
</script>
  
<main>
    <div class="card">
      <Integration_Button company="Google" />
    </div>
  
    <div class="card">
      <Integration_Button company="Microsoft" />
    </div>
  
    <div class="card">
      <Integration_Button company="Notion" />
    </div>
</main>
  
<style>
    main {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
  
    .card {
      margin-bottom: 16px;
    }
</style>

<!-- <script>
  //import * as Card from "$lib/components/ui/card/index.js";
  //import { Button } from "$lib/components/ui/button/index.js";
  import Integration_Button from '../../components/integration-button.svelte';

  let activeSection = 'integrations';

  const sections = {
    integrations: {
      title: 'Integrations',
      content: {
        type: 'integrations'
      }
    },
  };
</script>

<main>
  <div class="min-h-screen flex items-center justify-center p-4">
    <Card.Root class="w-full max-w-4xl">
      <Card.Header>
        <Card.Title class="text-2xl">Profile Settings</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="flex gap-6">
          <div class="w-48 space-y-2">
            {#each Object.entries(sections) as [key, section]}
              <Button
                variant={activeSection === key ? "default" : "ghost"}
                class="w-full justify-start"
                on:click={() => activeSection = key}
              >
                {section.title}
              </Button>
            {/each}
          </div>

          <div class="flex-1 border-l pl-6">
            <h2 class="text-xl font-semibold mb-4">
              Integrations
            </h2>          
              <div class="space-y-4">
                <div class="card">
                  <Integration_Button company="Google" />
                </div>
                <div class="card">
                  <Integration_Button company="Microsoft" />
                </div>
                <div class="card">
                  <Integration_Button company="Notion" />
                </div>
              </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</main> -->