<script lang="ts">
	import type { ListLicense } from '../../trpcClient'
	import CardActionButton from '../basics/CardActionButton.svelte'

	export let license: ListLicense
</script>

<div class="flex flex-col items-stretch space-y-1 text-sm text-left floating-actions">
	<CardActionButton icon="edit">Edit</CardActionButton>
	<CardActionButton icon="delete">Delete</CardActionButton>
</div>
