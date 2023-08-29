<script lang="ts">
	import type { ListLicense } from '../../trpcClient'
	import Chip from '../basics/Chip.svelte'

	export let license: ListLicense

	let className = ''

	export { className as class }

	let statusText = ''
	let statusColor = ''

	$: {
		if (!license.active) {
			statusText = 'Inactive'
			statusColor = 'gray-700'
		} else if (license.expirationDate && license.expirationDate < new Date()) {
			statusText = 'Expired'
			statusColor = 'red-500'
		} else if (license.expirationDate) {
			statusText =
				'Expires in ' + getRelativeTimeString(license.expirationDate.getTime() - Date.now())

			if (license.expirationDate.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 7) {
				statusColor = 'yellow-500'
			} else {
				statusColor = 'blue-500'
			}
		} else {
			statusText = 'Active'
			statusColor = 'blue-500'
		}
	}

	function getRelativeTimeString(durationMs: number) {
		// Output: 10 minutes OR 1 hour OR 2 days OR 3 months OR 1 year

		const durationSeconds = Math.floor(durationMs / 1000)
		const durationMinutes = Math.floor(durationSeconds / 60)
		const durationHours = Math.floor(durationMinutes / 60)
		const durationDays = Math.floor(durationHours / 24)
		const durationMonths = Math.floor(durationDays / 30)
		const durationYears = Math.floor(durationDays / 365)

		if (durationSeconds < 60) {
			return `${durationSeconds} seconds`
		} else if (durationMinutes < 60) {
			return `${durationMinutes} minutes`
		} else if (durationHours < 24) {
			return `${durationHours} hours`
		} else if (durationDays < 30) {
			return `${durationDays} days`
		} else if (durationMonths < 12) {
			return `${durationMonths} months`
		} else {
			return `${durationYears} years`
		}
	}
</script>

<Chip class={className} color={statusColor}>
	{statusText}
</Chip>
