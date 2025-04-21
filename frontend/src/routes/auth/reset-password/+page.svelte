<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_DISABLE_RECAPTCHA, PUBLIC_RECAPTCHA_SITE_KEY } from '$env/static/public'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { logSuccess } from '../../../lib/stores/alerts'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''

	let inputIssue: string = ''
	$: {
		if (email === '') {
			inputIssue = "Email can't be empty"
		} else {
			inputIssue = ''
		}
	}

	let loading = false

	async function resetPassword(token: string) {
		loading = true
		await trpc.auth.requestPasswordReset.mutate({ email, token }).finally(() => {
			loading = false
		})

		logSuccess(
			'If you have an account with us, we sent you an email with a link to reset your password.',
			10000,
		)
	}

	onMount(() => {
		// @ts-ignore
		window.resetPasswordCallback = resetPassword

		return () => {
			// @ts-ignore
			delete window.resetPasswordCallback
		}
	})

	function resetPasswordClick() {
		if (PUBLIC_DISABLE_RECAPTCHA === 'true') {
			resetPassword('')
		} else {
			// @ts-ignore
			grecaptcha.execute()
		}
	}
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<div class="flex flex-col">
	<div class="flex items-center">
		<span class="material-icons back-nav" on:click={() => goto('/auth/login')}>arrow_back</span>
		<h1 class="text-3xl font-semibold text-slate-700">Forgot password</h1>
	</div>
	<p>Enter your email address and we will send you a link to reset your password.</p>

	<span class="text-orange-400">
		{inputIssue}&nbsp;
	</span>
	<input type="text" placeholder="Email" class="mt-2" bind:value={email} />
	{#if PUBLIC_DISABLE_RECAPTCHA !== 'true'}
		<div
			class="z-30 g-recaptcha"
			data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
			data-callback="resetPasswordCallback"
			data-size="invisible"
		/>
	{/if}
	<Button {loading} disabled={!!inputIssue} on:click={resetPasswordClick} class="mt-4"
		>Send reset link</Button
	>
</div>
