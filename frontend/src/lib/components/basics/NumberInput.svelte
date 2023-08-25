<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let value: number
	export let step: number | undefined = undefined

	let internalValue: number | null

	let className = ''
	let input: HTMLInputElement

	export { className as class }

	function updateValue(internalValue: number | null) {
		value = internalValue ?? 0
	}

	function updateInternalValue(value: number) {
		internalValue = value
	}

	$: updateInternalValue(value)
	$: updateValue(internalValue)

	const dispatch = createEventDispatcher()

	function onBlur() {
		// Make sure input element displays 0 if value is 0
		if (value == 0) {
			input.value = '0'
		}

		dispatch('blur')
	}
</script>

<!-- Robust number input component (null not possible) -->
<input
	bind:this={input}
	type="number"
	{step}
	bind:value={internalValue}
	class="global-input-target {className}"
	on:blur={onBlur}
	on:focus
/>
