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