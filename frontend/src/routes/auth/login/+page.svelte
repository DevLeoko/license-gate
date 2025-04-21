<script lang="ts">
	import { goto } from '$app/navigation'
	import { PUBLIC_DISABLE_SIGN_UP, PUBLIC_GOOGLE_AUTH_CLIENT_ID } from '$env/static/public'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { logSuccess } from '../../../lib/stores/alerts'
	import { setLoggedIn } from '../../../lib/stores/auth'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let password = ''

	let inputIssue = ''
	let showIssue = false
	$: {
		if (email === '' || !isValidEmail()) {
			inputIssue = 'Email is required'
		} else if (password === '') {
			inputIssue = 'Password is required'
		} else {
			inputIssue = ''
		}
	}

	function isValidEmail() {
		// https://stackoverflow.com/a/46181/2715716
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
	}

	onMount(async () => {
		// Get token from url
		const urlParams = new URLSearchParams(window.location.search)
		const token = urlParams.get('token')
		const urlEmail = urlParams.get('email')

		if (token && urlEmail) {
			email = urlEmail
			await trpc.auth.verifyEmail.mutate({ token, email: urlEmail })
			logSuccess('Your email address has been verified.')

			// Clear url params
			window.history.replaceState({}, document.title, '/')
		}

		// Register signInWithGoogle callback as global function
		// @ts-ignore
		window.signInWithGoogleCallback = signInWithGoogle

		return () => {
			// @ts-ignore
			delete window.signInWithGoogleCallback
		}
	})

	let loading = false

	async function login() {
		if (inputIssue) {
			showIssue = true
			return
		}

		loading = true
		const { userId } = await trpc.auth.loginWithPassword.mutate({ email, password }).finally(() => {
			loading = false
		})
		setLoggedIn(userId, email.toLowerCase())

		goto('/dashboard')
	}

	async function signInWithGoogle(response: any) {
		loading = true
		const { userId, email } = await trpc.auth.loginWithGoogle
			.mutate({ token: response.credential, createAccountIfNotFound: false })
			.finally(() => {
				loading = false
			})
		setLoggedIn(userId, email)

		goto('/dashboard')
	}
</script>

<svelte:head>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<form class="flex flex-col w-[350px] max-w-full" on:submit|preventDefault={login}>
	<h1 class="text-3xl font-semibold text-slate-700">Sign in</h1>
	<span class="text-orange-400">
		{inputIssue && showIssue ? inputIssue : ''}&nbsp;
	</span>
	<input
		type="email"
		placeholder="Email"
		name="email"
		autocomplete="username"
		class="mt-2"
		bind:value={email}
	/>
	<input
		type="password"
		placeholder="Password"
		name="password"
		class="mt-2"
		bind:value={password}
		on:keypress={(e) => e.key === 'Enter' && login()}
	/>

	<Button {loading} on:click={login} class="mt-4">Login</Button>

	{#if PUBLIC_GOOGLE_AUTH_CLIENT_ID != 'none'}
		<div class="my-2 text-sm text-center text-gray-500">or</div>

		<div
			id="g_id_onload"
			data-client_id={PUBLIC_GOOGLE_AUTH_CLIENT_ID}
			data-context="signin"
			data-ux_mode="popup"
			data-callback="signInWithGoogleCallback"
			data-itp_support="true"
		/>

		<div class="flex justify-center">
			<div
				class="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="signin_with"
				data-size="large"
				data-logo_alignment="center"
			/>
		</div>
	{/if}

	<div class="mt-4">
		<a href="/auth/reset-password" class="text-blue-500">Forgot your password?</a>
	</div>
	{#if PUBLIC_DISABLE_SIGN_UP !== 'true'}
		<div>
			<span>Don't have an account?</span>
			<a href="/auth/signup" class="text-blue-500">Sign up</a>
		</div>
	{/if}
</form>
