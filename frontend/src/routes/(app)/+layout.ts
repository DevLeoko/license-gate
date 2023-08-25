import type { LayoutLoad } from './$types'

export const load = (async ({ parent }) => {
	await parent()
}) satisfies LayoutLoad
