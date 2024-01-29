<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import ConfirmationCard from './ConfirmationCard.svelte'

	export let requiresConfirmation = false
	export let confirmationOpen = false

	export let loading = false
	export let disabled = false
	export let outlined = false
	export let text = false
	export let gray = false
	export let snug = false
	export let red = false
	export let orange = false
	export let href: string | undefined = undefined
	export let target: undefined | '_blank' | '_self' | '_parent' | '_top' = undefined

	let className = ''

	export { className as class }

	const eventDispatcher = createEventDispatcher<{ click: MouseEvent }>()

	function handleClick(event: MouseEvent) {
		if (requiresConfirmation) {
			event.preventDefault()
			event.stopPropagation()
		}

		if (requiresConfirmation) {
			// Make sure target is not a child of .confirm-card
			let target = event.target as HTMLElement
			while (target.parentElement) {
				if (target.classList.contains('confirm-card')) {
					return
				}
				target = target.parentElement
			}

			confirmationOpen = true
		} else {
			eventDispatcher('click', event)
		}
	}

	function handleConfirm(event: CustomEvent<MouseEvent>) {
		confirmationOpen = false
		eventDispatcher('click', event.detail)
	}
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{href}
	{target}
	class="text-white font-medium rounded-sm relative {className} select-none block"
	class:loading
	class:disabled
	class:outlined
	class:text
	class:snug
	class:gray
	class:red
	class:orange
	on:click={handleClick}
>
	{#if requiresConfirmation && confirmationOpen}
		<ConfirmationCard on:confirm={handleConfirm} on:cancel={() => (confirmationOpen = false)} />
	{/if}

	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center h-full">
			<div class="lds-ellipsis">
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	{/if}
	<div class:invisible={loading} class="flex items-center justify-center gap-1 h-fu1l">
		<slot />
	</div>
</svelte:element>

<style lang="postcss">
	/* Define css variable for color */
	:root {
		--color: theme('colors.blue.500');
		--hover-color: theme('colors.blue.600');
	}

	button,
	a {
		@apply px-2 py-1;
		background-color: var(--color);

		&:hover {
			background-color: var(--hover-color);
		}

		&.snug {
			@apply py-0 px-2;
		}

		&.gray {
			--color: theme('colors.slate.500');
			--hover-color: theme('colors.slate.600');
		}

		&.red {
			--color: theme('colors.red.500');
			--hover-color: theme('colors.red.600');
		}

		&.orange {
			--color: theme('colors.orange.500');
			--hover-color: theme('colors.orange.600');
		}

		&.disabled {
			--color: theme('colors.gray.300');
			--hover-color: theme('colors.gray.300');
			pointer-events: none;
			cursor: default;
		}

		&.loading {
			--hover-color: theme('colors.blue.600');
			opacity: 0.7;
			pointer-events: none;
			cursor: default;
		}

		&.outlined {
			background-color: transparent;
			border: 1px solid var(--color);
			color: var(--color);

			&:hover {
				background-color: rgba(0, 0, 0, 0.02);
			}
		}

		&.text {
			background-color: transparent;
			color: var(--color);

			&:hover {
				background-color: transparent;
				color: var(--hover-color);
			}
		}
	}

	.lds-ellipsis {
		opacity: 0.5;
		position: relative;
		display: inline-block;
		width: 75px;
		height: 5px;
	}
	.lds-ellipsis div {
		position: absolute;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #fff;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}

	.outlined .lds-ellipsis {
		opacity: 0.7;
	}

	.outlined .lds-ellipsis div,
	.text .lds-ellipsis div {
		background: var(--color);
	}

	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 0.6s infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 0.6s infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>
