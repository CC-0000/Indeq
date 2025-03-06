<script lang="ts">
	import '../app.css';
	import { Toaster } from "$lib/components/ui/sonner";
    import { injectAnalytics } from '@vercel/analytics/sveltekit'

	let { children } = $props();
    
    // Vercel Analytics
    injectAnalytics({
        debug: false,
        mode: 'production'
    });
</script>

<Toaster theme="light" />
{@render children()}
