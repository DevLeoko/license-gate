<script lang="ts">
	let className = ''

	export { className as class }
</script>

<div class="px-4 py-2 bg-white border rounded-lg {className}">
	<slot />
</div>
