<script lang="ts">
	import {
		PUBLIC_DISABLE_RECAPTCHA,
		PUBLIC_GOOGLE_AUTH_CLIENT_ID,
		PUBLIC_RECAPTCHA_SITE_KEY,
	} from '$env/static/public'
	import { onMount } from 'svelte'
	import ConsentCheckBoxes from '../../../lib/components/auth/ConsentCheckBoxes.svelte'
	import BasicModal from '../../../lib/components/basics/BasicModal.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''
	let confirmPassword = ''

	let agreedToTerms = false
	let agreedToMarketing = false

	let inputIssue: string = ''
	let showIssue = false
	$: {
		if (email === '' || !isValidEmail()) {
			inputIssue = 'Email is required'
		} else if (password === '') {
			inputIssue = 'Password is required'
		} else if (!isPasswordSecure()) {
			inputIssue =
				'Password must be at least 8 characters long and contain at least one number and one letter'
		} else if (confirmPassword === '' || password !== confirmPassword) {
			inputIssue = 'Passwords do not match'
		} else {
			inputIssue = ''
		}
	}

	function isValidEmail() {
		// https://stackoverflow.com/a/46181/2715716
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	function isPasswordSecure() {
		// Password must be at least 8 characters long and contain at least one number and one letter
		return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password)
	}

	let loading = false
	let showSignupSuccess = false

	async function register(token: string) {
		loading = true
		await trpc.auth.signUpWithPassword
			.mutate({
				email,
				password,
				token,
				marketingEmails: agreedToMarketing,
			})
			.finally(() => {
				loading = false
			})

		showSignupSuccess = true
	}

	onMount(() => {
		// @ts-ignore
		window.registerCallback = register

		return () => {
			// @ts-ignore
			delete window.registerCallback
		}
	})

	function registerClick() {
		if (inputIssue || !agreedToTerms) {
			showIssue = true
			return
		}

		if (PUBLIC_DISABLE_RECAPTCHA === 'true') {
			register('')
		} else {
			// @ts-ignore
			grecaptcha.execute()
		}
	}
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

{#if showSignupSuccess}
	<BasicModal>
		<div class="flex flex-col items-center">
			<span class="text-3xl text-lime-500 material-icons-outlined"> done_outline </span>

			<h2 class="my-2 text-xl font-semibold">Verification mail sent - please check your inbox.</h2>
			<Button href="/auth/login" outlined class="max-w-full mt-4 w-max">Login</Button>
		</div>
	</BasicModal>
{/if}

<form class="flex flex-col w-[350px] max-w-full" on:submit|preventDefault={registerClick}>
	<h1 class="text-3xl font-semibold text-slate-700">Sign up</h1>
	<span class="text-orange-400">
		{inputIssue && showIssue ? inputIssue : ''}&nbsp;
	</span>
	<input
		type="email"
		name="email"
		autocomplete="username"
		placeholder="Email"
		class="mt-2"
		bind:value={email}
	/>
	<!-- Chrome should suggest password -->
	<input
		type="password"
		name="password"
		autocomplete="new-password"
		placeholder="Password"
		class="mt-2"
		bind:value={password}
	/>
	<input
		type="password"
		name="confirmPassword"
		autocomplete="new-password"
		placeholder="Confirm password"
		class="mt-2"
		bind:value={confirmPassword}
		on:focus={() => (showIssue = true)}
		on:keypress={(e) => e.key === 'Enter' && registerClick()}
	/>
	{#if PUBLIC_DISABLE_RECAPTCHA !== 'true'}
		<div
			class="z-30 g-recaptcha"
			data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY}
			data-callback="registerCallback"
			data-size="invisible"
		/>
	{/if}

	<ConsentCheckBoxes bind:agreedToTerms bind:agreedToMarketing />

	<Button {loading} disabled={!!inputIssue || !agreedToTerms} on:click={registerClick} class="mt-4"
		>Sign up</Button
	>

	<div
		id="g_id_onload"
		data-client_id={PUBLIC_GOOGLE_AUTH_CLIENT_ID}
		data-context="signup"
		data-ux_mode="popup"
		data-callback="signUpWithGoogleCallback"
		data-auto_prompt="false"
	/>

	<div class="mt-4">
		<span>Already have an account?</span>
		<a href="/auth/login" class="text-blue-500">Login</a>
	</div>
</form>
