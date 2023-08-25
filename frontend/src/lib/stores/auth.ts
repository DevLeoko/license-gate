import { derived, writable } from 'svelte/store'

const loggedInState = writable(false)

export const loggedIn = derived(loggedInState, ($loggedInState) => $loggedInState)

export function checkLoginState() {
	const loginTime = localStorage.getItem('loggedInUntil')

	if (loginTime && new Date(loginTime) > new Date()) {
		loggedInState.set(true)
	} else {
		loggedInState.set(false)
	}
}

export function setLoggedIn() {
	loggedInState.set(true)
	const loginDuration = 1000 * 60 * 60 * 24 * 7 // 7 days TODO: make this the same as the backend
	localStorage.setItem(
		'loggedInUntil',
		new Date(new Date().getTime() + loginDuration).toISOString(),
	)
}

export function setLoggedOut() {
	localStorage.removeItem('loggedInUntil')
	loggedInState.set(false)
}
