import type { LayoutLoad } from './$types'
import { goto } from '$app/navigation'
import { checkLoginState, loggedIn } from '../lib/stores/auth'
import { get } from 'svelte/store'

export const ssr = false

export const load: LayoutLoad = async (event) => {
	checkLoginState()
	const authRoute = event.route.id?.startsWith('/auth/')

	if (!get(loggedIn)) {
		if (!authRoute) return goto('/auth/login')
	} else {
		const isPasswordResetRoute = event.route.id == '/auth/password'
		const wrongAuthRoute = authRoute && !isPasswordResetRoute
		if (!event.route.id || wrongAuthRoute) return goto('/dashboard')
	}
}
