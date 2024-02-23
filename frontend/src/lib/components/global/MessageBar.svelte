<script context="module" lang="ts">
	import { alerts, removeAlert } from '../../stores/alerts'
</script>

<div class="relative">
	<!-- <div class="fixed z-50 w-screen h-56 bg-red-500 ">&nbsp;</div>
	<div class="fixed w-screen h-56 bg-red-500 z-90">&nbsp;</div> -->

	<div
		class="fixed top-0 flex flex-col items-center w-full text-black pointer-events-none"
		style="z-index: 90;"
	>
		{#each $alerts as alert, i (alert.startTime)}
			<div class="mt-2 bg-white rounded-sm">
				<div
					class="flex items-center w-lg max-w-full pt-1 px-3 pb-1.5 relative pointer-events-auto bg-opacity-10 border"
					class:bg-red-600={alert.type == 'error'}
					class:bg-lime-600={alert.type == 'success'}
					class:bg-blue-600={alert.type == 'info'}
					class:border-red-600={alert.type == 'error'}
					class:border-lime-600={alert.type == 'success'}
					class:border-blue-600={alert.type == 'info'}
					class:text-red-700={alert.type == 'error'}
					class:text-lime-700={alert.type == 'success'}
					class:text-blue-700={alert.type == 'info'}
					class:shake-animation={alert.attention}
				>
					<p>{alert.message}</p>
					<span
						class="material-icons cursor-pointer !text-base hover:opacity-70 p-2 ml-2 -mr-2"
						on:click={() => removeAlert(i)}
						on:keydown={() => removeAlert(i)}>close</span
					>
					<div
						class="absolute bottom-0 left-0 w-1/2 h-1 opacity-50 slider-animation"
						class:bg-red-600={alert.type == 'error'}
						class:bg-lime-600={alert.type == 'success'}
						class:bg-blue-600={alert.type == 'info'}
						style="animation-duration: {alert.duration}ms"
					/>
				</div>
			</div>
		{/each}
	</div>
</div>

<style lang="postcss">
	.slider-animation {
		animation-name: slider;
		animation-timing-function: linear;
		animation-duration: 5s;
	}

	.shake-animation {
		animation-name: shake;
		animation-timing-function: ease;
		animation-duration: 0.6s;
	}

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0%);
			transform-origin: 50% 50%;
		}
		15% {
			transform: translateX(-15px) rotate(1deg);
		}
		30% {
			transform: translateX(7px) rotate(-1deg);
		}
		45% {
			transform: translateX(-7px) rotate(0.8deg);
		}
		60% {
			transform: translateX(4px) rotate(-0.5deg);
		}
	}

	@keyframes slider {
		0% {
			width: 100%;
		}

		100% {
			width: 0%;
		}
	}
</style>
