<script lang="ts">
	import { onMount } from 'svelte'
	import BasicModal from '../../../lib/components/basics/BasicModal.svelte'
	import Button from '../../../lib/components/basics/Button.svelte'
	import ConfirmationCardTrigger from '../../../lib/components/basics/ConfirmationCardTrigger.svelte'
	import CopyText from '../../../lib/components/basics/CopyText.svelte'
	import Labeled from '../../../lib/components/basics/Labeled.svelte'
	import PageTitle from '../../../lib/components/basics/PageTitle.svelte'
	import Skeleton from '../../../lib/components/basics/Skeleton.svelte'
	import { trpc, type ListApiKey } from '../../../lib/trpcClient'

	let licenseKeys: ListApiKey[] | null = null

	onMount(() => {
		trpc.apiKey.list.query().then((res) => {
			licenseKeys = res
		})
	})

	let loadingDeleteId: number | null = null

	function deleteKey(id: number) {
		loadingDeleteId = id
		trpc.apiKey.delete
			.mutate({ id })
			.then(() => {
				licenseKeys = licenseKeys!.filter((key) => key.id !== id)
			})
			.finally(() => {
				loadingDeleteId = null
			})
	}

	let createApiKeyName = ''
	let createdApiKey: string | null = null

	let loadingCreate = false
	function createKey() {
		loadingCreate = true
		trpc.apiKey.create
			.mutate({ name: createApiKeyName })
			.then((res) => {
				licenseKeys = [res.apiKey, ...(licenseKeys ?? [])]
				createdApiKey = res.uncensoredApiKey.key
			})
			.finally(() => {
				loadingCreate = false
			})
	}

	function openCreateModal() {
		createApiKeyName = ''
		createdApiKey = null
		showCreateModal = true
	}

	let showCreateModal = false
</script>

{#if showCreateModal}
	<BasicModal on:exit={() => (showCreateModal = false)} title="Create secret API key">
		{#if !createdApiKey}
			<p class="text-sm mb-2">Enter a name for the new API key.</p>

			<Labeled label="Name">
				<input
					type="text"
					bind:value={createApiKeyName}
					class="max-w-56"
					placeholder="My backend key"
				/>
			</Labeled>

			<div class="flex gap-4 mt-8">
				<Button on:click={createKey} disabled={loadingCreate} loading={loadingCreate}>
					Create API key
				</Button>

				<Button on:click={() => (showCreateModal = false)} gray>Cancel</Button>
			</div>
		{:else}
			<p class="text-sm mb-2">
				Your new API key has been created. Please save it now, as it will not be displayed again.
			</p>

			<h2
				class="flex items-center justify-between w-full px-4 py-2 text-sm tracking-widest bg-gray-100 rounded-md"
			>
				{createdApiKey}
				<CopyText class="text-xl" text={createdApiKey} />
			</h2>

			<div class="flex gap-4 mt-8">
				<Button on:click={() => (showCreateModal = false)} gray>Close</Button>
			</div>
		{/if}
	</BasicModal>
{/if}

<PageTitle title="API keys" />

<div class="flex flex-col max-w-md gap-8">
	<div class="flex flex-col gap-4">
		<p>
			Your secret API keys are provided below. Please be aware that once generated, we will not
			display your API keys again. Do not share your API key with others, or use it in client-side
			code.
		</p>
		<p>
			To ensure the security of your account, LicenseGate may deactivate any API key that is exposed
			publicly.
		</p>
		<p class="border px-2 py-1 pt-0 text-sm border-gray-400 bg-red-500/5">
			<span class="material-icons-outlined text-lg translate-y-1">warning</span>
			These API keys are for managing your licenses programmatically.
			<b>An API key must not be used to verify licenses!</b>
			The endpoint for verifying licenses does not require an API key.
		</p>
	</div>

	<table class="w-full">
		<thead>
			<tr>
				<th class="text-left">Name</th>
				<th class="text-left">Key</th>
				<th class="text-left w-44">Created at</th>
				<th class="w-8" />
			</tr>
		</thead>
		<tbody>
			{#if licenseKeys}
				{#each licenseKeys as key}
					<tr>
						<td>{key.name}</td>
						<td class="font-mono">{key.key}</td>
						<td>{key.createdAt.toLocaleString()}</td>
						<th>
							{#if loadingDeleteId === key.id}
								<Skeleton class="w-6 h-6" />
							{:else}
								<ConfirmationCardTrigger on:confirm={() => deleteKey(key.id)}>
									<button>
										<span class="material-icons-outlined text-lg text-red-500">delete</span>
									</button>
								</ConfirmationCardTrigger>
							{/if}
						</th>
					</tr>
				{/each}

				{#if licenseKeys.length === 0}
					<tr>
						<td colspan="4" class="text-sm text-gray-500 p-2">
							You have not generated any API keys yet.
						</td>
					</tr>
				{/if}
			{:else}
				<tr>
					<td colspan="4">
						<Skeleton class="w-full h-8" />
					</td>
				</tr>
			{/if}
		</tbody>
	</table>

	<Button on:click={openCreateModal} gray snug>
		<span class="material-icons text-lg"> add </span>
		Create secret API key
	</Button>
</div>

<style lang="postcss">
	p {
		@apply text-gray-600;
	}
</style>
