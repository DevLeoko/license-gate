<script lang="ts">
	import { page } from '$app/stores'

	export let pages: { href: string; icon: string }[] = []

	export let showMenu = false
</script>

<div
	class="fixed bottom-0 z-20 flex w-full p-2 border-t justify-evenly md:hidden bg-slate-100 border-slate-200"
>
	{#each pages as link}
		{@const active = $page.url.pathname.startsWith(link.href)}
		<a href={link.href} class="p-2" class:text-primary-500={active} class:text-gray-500={!active}>
			<span class="material-icons !text-2xl relative">
				{link.icon}
			</span>
		</a>
	{/each}
	<span
		class="material-icons !text-2xl relative p-2 cursor-pointer"
		on:click={() => (showMenu = true)}
	>
		menu
	</span>
</div>
