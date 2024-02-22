<script lang="ts">
	import Navbar from '../../lib/components/global/Navbar.svelte'
</script>

<div class="flex">
	<Navbar />
	<div class="flex-grow min-w-0 p-4 mb-16 md:p-8 md:mb-0 max-h-[100dvh] overflow-y-auto flex-1">
		<div class="max-w-screen-xl">
			<slot />
		</div>
	</div>
</div>
