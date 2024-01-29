<script lang="ts">
	export let color = 'blue-500'
	export let backgroundColor = ''

	let className = ''
	export let snug = false

	export { className as class }
</script>

<span
	class="{snug
		? 'py-0.5 px-1.5'
		: 'py-1 px-2'} block text-xs font-medium leading-none text-{color} border border-{color} w-max shadow-sm uppercase rounded-full bg-opacity-5 bg-{backgroundColor ||
		color} {className}"
>
	<slot />
</span>
