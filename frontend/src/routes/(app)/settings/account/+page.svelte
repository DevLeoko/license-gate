<script lang="ts">
	import { onMount, tick } from 'svelte'
	import Button from '../../../../lib/components/basics/Button.svelte'
	import Chip from '../../../../lib/components/basics/Chip.svelte'
	import PageTitle from '../../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../../lib/components/basics/Skeleton.svelte'
	import { logSuccess } from '../../../../lib/stores/alerts'
	import { logout } from '../../../../lib/stores/auth'
	import { trpc, type ReadMe } from '../../../../lib/trpcClient'
	import { generateRsaKeyPair } from '../../../../lib/utils/rsaKeys'
	import { sleep } from '../../../../lib/utils/sleep'

	let myData: ReadMe | null = null

	onMount(async () => {
		myData = await trpc.auth.me.query()
	})

	let loadingPasswordReset = false
	let signOutAllDevices = false

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

	let loadingConsentUpdate = false

	async function toggleMarketingConsent() {
		if (!myData) return

		loadingConsentUpdate = true
		await trpc.auth.update
			.mutate({
				marketingEmails: !myData.marketingEmails,
			})
			.then(() => {
				myData!.marketingEmails = !myData!.marketingEmails
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
		logout()
		logSuccess('Deleted account')
	}

	let loadingRegenerate = false

	async function regenerateKeyPair() {
		loadingRegenerate = true

		await tick()
		await sleep(100)

		const keys = generateRsaKeyPair()

		await trpc.auth.updateRsaPublicKey
			.mutate(keys)
			.then(() => {
				myData!.rsaPublicKey = keys.rsaPublicKey
			})
			.finally(() => {
				loadingRegenerate = false
			})

		logSuccess('Generated new key-pair')
	}
</script>

<PageTitle title="Account settings" />

<div class="flex flex-col max-w-md">
	{#if !myData}
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
			<b>RSA key pair</b>
			<p class="text-sm">
				The RSA keys are used to sign the license server response when you provide a challenge with
				your verification request.
			</p>

			<p class="px-2 py-1 my-2 overflow-auto font-mono text-sm text-gray-600 bg-gray-100 max-h-36">
				{myData.rsaPublicKey || 'None set'}
			</p>

			<Button on:click={regenerateKeyPair} requiresConfirmation loading={loadingRegenerate} snug
				>Generate new key-pair</Button
			>
			<i class="text-xs">The key-pair is generated on your device and stored on the server.</i>
		</div>

		<div class="px-3 py-2 mt-2 bg-gray-200">
			<b>Marketing consent</b>
			<div class="flex items-center {loadingConsentUpdate ? 'opacity-50' : ''}">
				<input
					id="marketingConsent"
					type="checkbox"
					checked={myData.marketingEmails}
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
