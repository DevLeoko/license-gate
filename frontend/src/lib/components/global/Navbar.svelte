<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { logout, userEmail, userId } from '../../stores/auth'
	import { trpc } from '../../trpcClient'
	import Button from '../basics/Button.svelte'
	import Chip from '../basics/Chip.svelte'
	import MobileNavbar from './MobileNavbar.svelte'

	let licenseCount: null | number = null

	onMount(async () => {
		licenseCount = await trpc.license.countActive.query()
	})

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
			name: 'Logs',
			icon: 'manage_search',
			href: '/logs',
			primary: true,
		},
		{
			name: 'API keys',
			icon: 'lock_open',
			href: '/api-keys',
			primary: false,
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
	<div class="flex justify-center mt-2">
		<Chip>Early access</Chip>
	</div>

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

	<div class="flex flex-col gap-2 mt-auto mb-4 text-sm text-center text-gray-600">
		<div>
			Logged in as <br />
			<b class="font-medium text-black">{$userEmail}</b> <br />
			<span class="font-mono">User ID: {$userId}</span>
		</div>

		<div>
			Serving <b class="font-medium text-blue-500">{licenseCount ?? '-'}</b> active licenses
		</div>
	</div>

	<Button on:click={logout} outlined class="">Logout</Button>
	<Button class="mt-4 mb-4 md:hidden" outlined gray>Close</Button>
	<div
		class="flex justify-between mt-1 mb-8 text-xs text-gray-700 md:mb-4"
		on:click|stopPropagation
	>
		<span
			>&copy; LicenseGate
			{new Date().getFullYear()}
		</span>
	</div>
</div>

<MobileNavbar pages={PAGES.filter((p) => p.primary)} bind:showMenu />
