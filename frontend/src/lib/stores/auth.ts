import { goto } from '$app/navigation'
import { persisted } from 'svelte-persisted-store'
import { derived, get } from 'svelte/store'

type LoggedInState = {
	userId: string
	email: string
	loggedInUntil: number
} | null

const loggedInState = persisted('loggedInState', null as LoggedInState)

export const loggedIn = derived(loggedInState, ($loggedInState) => !!$loggedInState)
export const userId = derived(loggedInState, ($loggedInState) => $loggedInState?.userId)
export const userEmail = derived(loggedInState, ($loggedInState) => $loggedInState?.email)

export function checkLoginState() {
	const loggedInUntil = get(loggedInState)?.loggedInUntil

	if (!loggedInUntil) return

	if (loggedInUntil < new Date().getTime()) {
		loggedInState.set(null)
	}
}

export function setLoggedIn(userId: string, email: string) {
	const loginDuration = 1000 * 60 * 60 * 24 * 7 // 7 days TODO: make this the same as the backend
	const loggedInUntil = new Date().getTime() + loginDuration
	loggedInState.set({ userId, email, loggedInUntil })
}

export function logout() {
	goto('/auth/login?logout=true').then(() => {
		loggedInState.set(null)
	})
}
