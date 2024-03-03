<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_GOOGLE_AUTH_CLIENT_ID } from '$env/static/public'
	import { onMount } from 'svelte'
	import ConsentCheckBoxes from '../../../lib/components/auth/ConsentCheckBoxes.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { setLoggedIn } from '../../../lib/stores/auth'
	import { trpc } from '../../../lib/trpcClient'

	let agreedToTerms = false
	let agreedToMarketing = false

	let loading = false

	let googleToken: string | null = null

	async function signUpWithGoogle(response: any) {
		googleToken = response.credential
	}

	async function completeSignup() {
		loading = true
		const { userId, email } = await trpc.auth.loginWithGoogle
			.mutate({
				token: googleToken!,
				createAccountIfNotFound: true,
				marketingEmails: agreedToMarketing,
			})
			.finally(() => {
				loading = false
			})
		setLoggedIn(userId, email)

		goto('/dashboard')
	}

	onMount(() => {
		// @ts-ignore
		window.signUpWithGoogleCallback = signUpWithGoogle

		return () => {
			// @ts-ignore
			delete window.signInWithGoogleCallback
		}
	})
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div class="flex flex-col w-[350px]">
	<h1 class="text-3xl font-semibold text-slate-700">Sign up</h1>

	{#if !googleToken}
		<Button href="/auth/signup-password" gray class="mt-8">Sign up using email</Button>

		{#if PUBLIC_GOOGLE_AUTH_CLIENT_ID != 'none'}
			<div class="my-2 text-sm text-center text-gray-500">or</div>

			<div
				id="g_id_onload"
				data-client_id={PUBLIC_GOOGLE_AUTH_CLIENT_ID}
				data-context="signup"
				data-ux_mode="popup"
				data-callback="signUpWithGoogleCallback"
				data-auto_prompt="false"
			/>

			<div class="flex justify-center">
				<div
					class="g_id_signin"
					data-type="standard"
					data-shape="rectangular"
					data-theme="outline"
					data-text="signup_with"
					data-size="large"
					data-logo_alignment="center"
				/>
			</div>
		{/if}
	{:else}
		<ConsentCheckBoxes bind:agreedToTerms bind:agreedToMarketing />
		<Button class="mt-4" on:click={completeSignup} {loading} disabled={!agreedToTerms}>
			Complete sign up
		</Button>
	{/if}

	<div class="mt-4">
		<a href="/auth/login" class="text-blue-500">Already have an account?</a>
	</div>
</div>
