<script lang="ts">
	import Navbar from '../../lib/components/global/Navbar.svelte'
</script>

<div class="flex max-w-screen-2xl">
	<Navbar />
	<div class="flex-grow min-w-0 p-4 mb-16 md:p-8 md:mb-0">
		<slot />
	</div>
</div>
