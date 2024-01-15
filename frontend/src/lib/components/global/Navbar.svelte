<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { setLoggedOut } from '../../stores/auth'
	import Button from '../basics/Button.svelte'
	import MobileNavbar from './MobileNavbar.svelte'

	function logout() {
		setLoggedOut()
		goto('/')
	}

	const PAGES = [
		{
			name: 'Dashboard',
			icon: 'dashboard',
			href: '/dashboard',
			primary: true,
		},
		{
			name: 'Manage licenses',
			icon: 'password',
			href: '/licenses',
			primary: true,
		},
		{
			name: 'Account settings',
			icon: 'settings',
			href: '/settings/account',
			primary: true,
		},
	] as const

	let showMenu = false
</script>

<div
	class="hidden md:flex flex-col bg-white h-screen w-full px-4 pt-8 md:border-r md:w-60 md:min-w-[240px] {showMenu
		? '!flex fixed top-0 left-0 w-screen h-screen z-30'
		: ''}"
	on:click={() => (showMenu = false)}
>
	<!-- <img src="" alt="logo" class="self-center w-2/3" /> -->
	<a class="flex items-center justify-center md:justify-start" href="/">
		<img class="h-8" src="/logo.svg" alt="logo" />
	</a>

	<nav class="flex flex-col mt-6">
		{#each PAGES as link (link.href)}
			{@const active = $page.url.pathname.startsWith(link.href)}
			<a
				href={link.href}
				class="flex items-center px-2 py-1 my-2 rounded-sm hover:bg-slate-100"
				class:bg-slate-100={active}
				class:text-slate-700={!active}
			>
				<span class="material-icons mr-2 !text-lg relative">
					{link.icon}
				</span>
				<span class="relative font-semibold">
					{link.name}
				</span>
			</a>
		{/each}
	</nav>
	<Button on:click={logout} outlined class="mt-auto">Logout</Button>
	<Button class="mt-4 mb-4 md:hidden" outlined gray>Close</Button>
	<div
		class="flex justify-between mt-1 mb-8 text-xs text-gray-700 md:mb-4"
		on:click|stopPropagation
	>
		<span>&copy; LicenseGate 2023</span>
	</div>
</div>

<MobileNavbar pages={PAGES.filter((p) => p.primary)} bind:showMenu />
