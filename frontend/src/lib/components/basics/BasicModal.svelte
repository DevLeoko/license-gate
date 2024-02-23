<script lang="ts">
	import Modal from './Modal.svelte'
	export let zLevel = 50

	export let title = ''

	let className = ''

	export { className as class }
</script>

<Modal on:exit {zLevel}>
	<div
		class="flex flex-col max-h-[80dvh] p-6 pt-4 bg-white rounded-md {className}"
		style="width: 600px;"
	>
		<h2 class="mb-2 text-lg">
			<slot name="title">
				{title}
			</slot>
		</h2>
		<div class="flex-grow overflow-y-auto">
			<slot />
		</div>
		{#if $$slots.action}
			<div class="flex justify-end pt-4">
				<slot name="action" />
			</div>
		{/if}
	</div>
</Modal>
