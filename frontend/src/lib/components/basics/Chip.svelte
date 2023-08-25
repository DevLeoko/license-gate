<script lang="ts">
	export let color = 'blue-500'

	let className = ''
	export let snug = false

	export { className as class }
</script>

<span
	class="{snug
		? 'py-0 px-1.5'
		: 'py-0.5 px-2'} text-xs font-medium leading-none text-{color} border border-{color} w-max shadow-sm uppercase rounded-full bg-opacity-10 bg-{color} {className}"
>
	<slot />
</span>
