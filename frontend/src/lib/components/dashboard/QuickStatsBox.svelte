<script lang="ts">
	export let icon: string
	export let title: string
	export let value: string
</script>

<div class="flex items-center w-60">
	<div class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-md">
		<span class="material-icons-outlined">
			{icon}
		</span>
	</div>
	<div class="ml-2">
		<h3 class="text-sm font-semibold leading-none text-gray-500">{title}</h3>
		<p class="mt-1 text-xl font-semibold leading-none text-gray-800">{value}</p>
	</div>
</div>
