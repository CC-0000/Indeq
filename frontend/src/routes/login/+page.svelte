<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="min-w-96 flex flex-col gap-4">
		<Card.Root class="w-full max-w-sm mx-auto">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Welcome back</Card.Title>
				<Card.Description>Enter your email below to login to your account</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<Button variant="outline">
					<img src="/google.svg" alt="Google logo" class="mr-2 h-6 w-6" />
					Login with Google
				</Button>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t"></span>
					</div>
					<div class="relative flex justify-center text-xs">
						<span class="bg-card text-muted-foreground px-2"> Or continue with </span>
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" />
				</div>
			</Card.Content>
			<Card.Footer class="flex flex-col gap-4">
				<Button class="w-full">Login</Button>
				<Card.Description class="relative text-center">Don't have an account? <a class="underline hover:text-primary" href="/register">Sign up</a></Card.Description>
			</Card.Footer>
		</Card.Root>
        <Card.Description class="text-center text-sm text-muted-foreground">&nbsp;</Card.Description>
	</div>
</div>