<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { fly } from 'svelte/transition'

	const dispatch = createEventDispatcher<{ clickOutside: MouseEvent }>()

	let el: HTMLDivElement

	export let preferTop = false
	export let preferLeft = false

	function ensureConstraints(
		box: {
			x: number
			y: number
			width: number
			height: number
		},
		constraints: {
			x: number
			y: number
			width: number
			height: number
		},
	) {
		const { x, y, width, height } = box
		const {
			width: constraintWidth,
			height: constraintHeight,
			x: constraintX,
			y: constraintY,
		} = constraints

		const constrainedX = Math.min(
			Math.max(x, constraintX + 5),
			constraintX + constraintWidth - width - 5,
		)
		const constrainedY = Math.min(
			Math.max(y, constraintY + 5),
			constraintY + constraintHeight - height - 5,
		)

		return { x: constrainedX, y: constrainedY }
	}

	function getParentBounds(parent: HTMLElement) {
		const {
			left: parentLeft,
			top: parentTop,
			width: parentWidth,
			height: parentHeight,
		} = parent.getBoundingClientRect()
		const parentRight = parentLeft + parentWidth
		const parentBottom = parentTop + parentHeight

		return {
			parentLeft,
			parentTop: parentTop + window.scrollY,
			parentRight,
			parentBottom: parentBottom + window.scrollY,
		}
	}

	let parent = null as HTMLElement | null

	let windowWidth: number
	let windowHeight: number

	function recomputePlacement() {
		const { parentLeft, parentTop, parentRight, parentBottom } = getParentBounds(parent!)
		const { width, height } = el.getBoundingClientRect()

		let preferredLeft = preferLeft ? parentRight - width : parentLeft
		let preferredTop = preferTop ? parentTop - height - 5 : parentBottom + 5

		const { x, y } = ensureConstraints(
			{ x: preferredLeft, y: preferredTop, width, height },
			{ x: 0, y: window.scrollY, width: windowWidth, height: windowHeight },
		)

		el.style.left = `${x}px`
		el.style.top = `${y}px`
	}

	onMount(() => {
		windowWidth = document.body.clientWidth
		windowHeight = window.innerHeight

		parent = el.parentElement!

		const observer = new ResizeObserver(() => {
			recomputePlacement()
		})

		observer.observe(el)
		observer.observe(parent)

		const cancelId = setTimeout(() => {
			recomputePlacement()
		}, 300)

		const floatingCardContainer = document.querySelector('#floatingCardContainer')!
		parent.removeChild(el)
		floatingCardContainer.appendChild(el)

		return () => {
			observer.disconnect()
			floatingCardContainer.removeChild(el)
			clearTimeout(cancelId)
		}
	})

	function onBodyClick(event: MouseEvent) {
		// Check if the click was outside the card
		if (!el.contains(event.target as Node)) {
			dispatch('clickOutside', event)
		}
	}

	let className = ''

	export { className as class }
</script>

<svelte:body on:click|capture={onBodyClick} />

<div
	class="absolute z-60 flex items-center px-3 py-2 text-black bg-white rounded-md shadow w-max border border-gray-100 {className}"
	bind:this={el}
	on:click
	transition:fly|local={{ duration: 100, y: 10 }}
>
	<slot />
</div>
