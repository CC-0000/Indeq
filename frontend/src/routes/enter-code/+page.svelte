<script lang="ts">
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { enhance } from '$app/forms';
  import { toast } from 'svelte-sonner';
  import { goto } from '$app/navigation';

  export let form;
  export let data: { context: string };

  $: if (form?.success) {
    if (form.verifiedType === 'register') {
      toast.success('Welcome aboard! 🎉');
      goto('/chat');
    } else if (form.verifiedType === 'forgot') {
      goto('/reset-password');
    }
  }

  $: if (form?.error) {
    toast.error(form.error);
  }
</script>

<svelte:head>
  <title>Enter Code | Indeq</title>
  <meta name="description" content="Enter the verification code sent to your email" />
</svelte:head>

<div class="min-h-screen flex items-center justify-center">
  <div class="flex flex-col gap-4 min-w-96">
    <Card.Root class="w-full max-w-sm mx-auto">
      <Card.Header class="space-y-1">
        <Card.Title class="text-2xl">Enter your code</Card.Title>
        <Card.Description>
          We've sent a 6-digit code to your email. Enter it below to
          {data.context === 'register' ? ' complete your registration.' : ' reset your password.'}
        </Card.Description>
      </Card.Header>

      <!-- Primary form for submitting the OTP -->
      <form method="POST" use:enhance>
        <Card.Content class="grid gap-4">
          <input type="hidden" name="type" value={data.context} />
          <div class="grid gap-2">
            <Label for="code">Verification Code</Label>
            <Input
              id="code"
              name="code"
              type="text"
              inputmode="numeric"
              maxlength={6}
              placeholder="123456"
              required
            />
          </div>

          {#if form?.error}
            <p class="text-destructive text-sm">{form.error}</p>
          {/if}
        </Card.Content>
        <Card.Footer class="flex flex-col gap-4">
          <Button type="submit" class="w-full">Submit Code</Button>
        </Card.Footer>
      </form>

      <!-- Resend form is separate to avoid nested forms -->
      <form method="POST" use:enhance class="px-6 pt-0 pb-6 flex flex-col gap-4">
        <input type="hidden" name="resend" value="true" />
        <input type="hidden" name="type" value={data.context} />
        <Button type="submit" variant="outline" class="w-full">Resend Code</Button>
        <Card.Description class="text-center text-sm text-muted-foreground">
          Didn't receive it? Check your spam folder.
        </Card.Description>
      </form>
    </Card.Root>
  </div>
</div>