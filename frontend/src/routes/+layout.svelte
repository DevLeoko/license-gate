<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import '../app.scss'
	import MessageBar from '../lib/components/global/MessageBar.svelte'

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				// Disabled for development because it's annoying - reconsider for production
				refetchOnWindowFocus: false,
				retry: false,
				// This can be decreased for accounts with multiple users
				staleTime: 1000 * 60 * 10,
			},
		},
	})
</script>

<svelte:head>
	<title>LicenseGate</title>
	<!-- TODO: This should be adjusted per page for better UX -->
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="relative z-[60]" id="floatingCardContainer" />
	<MessageBar />
	<slot />
</QueryClientProvider>
