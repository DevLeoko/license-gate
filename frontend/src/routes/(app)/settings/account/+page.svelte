<script lang="ts">
	import { onMount } from 'svelte'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Chip from '../../../../lib/components/basics/Chip.svelte'
	import PageTitle from '../../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import {
		createAuthDataMutation,
		createAuthDataQuery,
	} from '../../../../lib/controller/query/auth'
	import { logSuccess } from '../../../../lib/stores/alerts'
	import { setLoggedOut } from '../../../../lib/stores/auth'
	import { trpc, type ReadMe } from '../../../../lib/trpcClient'

	let myData: ReadMe | null = null
	let loadingPasswordReset = false

	let signOutAllDevices = false

	onMount(async () => {
		myData = await trpc.auth.me.query()
	})

	function resetPassword() {
		loadingPasswordReset = true
		trpc.auth.requestPasswordResetNoCaptcha
			.mutate({ signOutAllDevices })
			.then(() => {
				logSuccess('We sent you an email with a link to reset your password.')
			})
			.finally(() => {
				loadingPasswordReset = false
			})
	}

	const authData = createAuthDataQuery()
	const updateAuthData = createAuthDataMutation()

	let loadingConsentUpdate = false

	async function toggleMarketingConsent() {
		if (!$authData.data) return

		loadingConsentUpdate = true
		await $updateAuthData
			.mutateAsync({
				marketingEmails: !$authData.data.marketingEmails,
			})
			.finally(() => {
				loadingConsentUpdate = false
			})

		logSuccess('Saved settings')
	}

	let loadingDelete = false

	async function deleteAccount() {
		loadingDelete = true
		await trpc.auth.deleteAccount.mutate().finally(() => {
			loadingDelete = false
		})
		setLoggedOut()
		logSuccess('Deleted account')
	}
</script>

<PageTitle title="Account settings" />

<div class="flex flex-col max-w-md">
	{#if !myData || !$authData.data}
		<Skeleton class="h-20 max-w-md" />
	{:else}
		<div class="px-3 py-2 mt-2 bg-gray-200">
			<b>User ID</b> <span>{myData.userId}</span> <br />
		</div>

		<div class="px-3 py-2 mt-2 bg-gray-200">
			<b>Email</b> <span>{myData.email}</span> <br />
			<i class="text-sm text-gray-500"
				>You can not change your email address - please get in touch if you have any issues.</i
			>
		</div>

		<div class="px-3 py-2 mt-2 bg-gray-200">
			{#if myData.isPasswordAccount}
				<b>Password</b>
				<p class="text-sm">
					When requesting a password reset, you will be sent an email with a link to reset your
					password. <br />
					<br />
					You can choose whether to sign out all signed in devices or not. Signed in devices can still
					access the account for up to an hour.
				</p>

				<div class="my-2">
					<input type="checkbox" bind:checked={signOutAllDevices} id="signOutAllDevices" />
					<label for="signOutAllDevices" class="cursor-pointer">Sign out all devices</label>
				</div>

				<Button loading={loadingPasswordReset} snug on:click={resetPassword}>Reset password</Button>
			{:else}
				<div class="flex items-center mb-1">
					<b>Password</b>
					<Chip class="ml-2">Google account</Chip>
				</div>

				<i class="text-sm text-gray-500"
					>You are using google oauth. You can change your password by changing your google
					password.</i
				>
			{/if}
		</div>

		<div class="px-3 py-2 mt-2 bg-gray-200">
			<b>Marketing consent</b>
			<div class="flex items-center {loadingConsentUpdate ? 'opacity-50' : ''}">
				<input
					id="marketingConsent"
					type="checkbox"
					checked={$authData.data.marketingEmails}
					on:change={toggleMarketingConsent}
				/>
				<label for="marketingConsent" class="ml-1 text-sm cursor-pointer"
					>I agree to receive marketing emails from LicenseGuard</label
				>
			</div>
		</div>

		<div class="px-3 py-2 mt-2 bg-gray-200 border-l-4 border-red-500">
			<b>Delete account</b>
			<p>Delete your account and all your data permanently</p>
			<Button
				class="mt-2"
				snug
				red
				requiresConfirmation
				on:click={deleteAccount}
				loading={loadingDelete}
			>
				Delete account
			</Button>
		</div>
	{/if}
</div>
