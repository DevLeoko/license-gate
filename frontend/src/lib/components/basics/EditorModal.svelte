<script lang="ts" context="module">
	export type EditorSelection<E> = { entity: E; id?: number } | null

	// Required language properties
	// updated:
	// deleted:
	// create:
	// update:
</script>

<script lang="ts">
	import type { TranslationPaths } from '../../translations/translations'

	import { logSuccess, t } from '../../stores/settings'

	import type { SvelteComponentTyped } from 'svelte/internal'
	import BasicModal from './BasicModal.svelte'
	import Button from './Button.svelte'

	type E = $$Generic
	type C = $$Generic<
		typeof SvelteComponentTyped<{ entity: E; inputError?: string | null }, any, any>
	>

	export let editor: C

	let inputError: string | null = null
	let loadingSave = false
	let loadingDelete = false

	$: anyLoading = loadingSave || loadingDelete

	export let name: string

	export let selected: EditorSelection<E> = null

	export let onSave: (selected: { entity: E; id?: number }) => Promise<void>
	export let onDelete: (id: number) => Promise<void> = async () => {}

	function performSave() {
		loadingSave = true
		onSave(selected!)
			.then(() => {
				if (selected!.id === undefined) {
					$logSuccess(`${name}.created` as TranslationPaths)
				} else {
					$logSuccess(`${name}.updated` as TranslationPaths)
				}

				selected = null
			})
			.finally(() => {
				loadingSave = false
			})
	}

	async function performDelete() {
		loadingDelete = true
		try {
			await onDelete(selected!.id!)
			selected = null

			$logSuccess(`${name}.deleted` as TranslationPaths)
		} finally {
			loadingDelete = false
		}
	}

	$: title = $t(`${name}.${selected?.id !== undefined ? 'update' : 'create'}` as TranslationPaths)
</script>

{#if selected}
	<BasicModal on:exit={() => (selected = null)} {title}>
		<svelte:component this={editor} bind:entity={selected.entity} bind:inputError />

		{#if inputError}
			<div class="mt-2 text-red-500">{inputError}</div>
		{/if}
		<div class="flex justify-end w-full mt-4" slot="action">
			{#if selected.id !== undefined}
				<Button
					outlined
					disabled={anyLoading}
					loading={loadingDelete}
					requiresConfirmation
					on:click={() => performDelete()}
					class="mr-auto"
					red>{$t('general.delete')}</Button
				>
			{/if}

			<Button disabled={loadingSave} on:click={() => (selected = null)} gray
				>{$t('general.cancel')}</Button
			>
			<Button
				loading={loadingSave}
				on:click={() => performSave()}
				disabled={!!inputError || anyLoading}
				class="ml-2">{$t('general.save')}</Button
			>
		</div>
	</BasicModal>
{/if}
