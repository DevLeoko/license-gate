<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import { logSuccess } from '../../../lib/stores/alerts'
	import { trpc } from '../../../lib/trpcClient'

	let email = ''
	let token = ''
	let newPassword = ''
	let confirmPassword = ''

	let inputIssue: string = ''
	$: {
		if (newPassword === '') {
			inputIssue = 'New password is required'
		} else if (newPassword !== confirmPassword) {
			inputIssue = 'Passwords do not match'
		} else {
			inputIssue = ''
		}
	}

	let loading = false

	async function resetPassword() {
		loading = true
		await trpc.auth.resetPassword.mutate({ email, token, password: newPassword }).finally(() => {
			loading = false
		})
		logSuccess('Your password has been reset.')
		goto('/')
	}

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search)
		email = urlParams.get('email') || ''
		token = urlParams.get('token') || ''
	})
</script>

<div class="flex flex-col">
	<h1 class="text-3xl font-semibold text-slate-700">Reset password</h1>
	<span class="text-orange-400">
		{inputIssue}&nbsp;
	</span>
	<input type="text" placeholder="Email" class="mt-2" bind:value={email} disabled />
	<input type="password" placeholder="New password" class="mt-2" bind:value={newPassword} />
	<input
		type="password"
		placeholder="Confirm new password"
		class="mt-2"
		bind:value={confirmPassword}
	/>
	<Button {loading} disabled={!!inputIssue} on:click={resetPassword} class="mt-4"
		>Reset password</Button
	>
</div>
