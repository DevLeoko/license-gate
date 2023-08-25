import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import { trpc } from '../../trpcClient'

const AUTH_KEYS = {
	all: ['userSettings'],
	read: () => [...AUTH_KEYS.all, 'read'],
}

export function createAuthDataQuery() {
	return createQuery({
		queryKey: AUTH_KEYS.read(),
		queryFn: () => trpc.auth.me.query(),
	})
}

export function createAuthDataMutation() {
	const queryClient = useQueryClient()
	return createMutation({
		mutationFn: async (authData: { marketingEmails: boolean }) => {
			await trpc.auth.update.mutate(authData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries(AUTH_KEYS.all)
		},
	})
}

export function queryAuthData() {
	return useQueryClient().fetchQuery({
		queryKey: AUTH_KEYS.read(),
		queryFn: () => trpc.auth.me.query(),
	})
}
