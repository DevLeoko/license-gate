import { goto } from '$app/navigation'
import { get } from 'svelte/store'
import { checkLoginState, loggedIn } from '../lib/stores/auth'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = async (event) => {
	checkLoginState()
	const authRoute = event.route.id?.startsWith('/auth/')

	const hasLogoutFlag = event.url.searchParams.get('logout') == 'true'

	if (hasLogoutFlag) {
		event.url.searchParams.delete('logout')
		history.replaceState(null, '', event.url.toString())
	}

	if (!get(loggedIn) || hasLogoutFlag) {
		if (!authRoute) return goto('/auth/login')
	} else {
		const isPasswordResetRoute = event.route.id == '/auth/password'
		const wrongAuthRoute = authRoute && !isPasswordResetRoute
		if (!event.route.id || wrongAuthRoute) return goto('/dashboard')
	}
}
