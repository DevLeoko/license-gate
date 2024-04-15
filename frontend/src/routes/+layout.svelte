<script lang="ts">
	import '../app.scss'
	import MessageBar from '../lib/components/global/MessageBar.svelte'
</script>

<svelte:head>
	<title>LicenseGate</title>
	<!-- TODO: This should be adjusted per page for better UX -->
</svelte:head>

<div class="relative z-[60]" id="floatingCardContainer" />
<MessageBar />
<slot />
