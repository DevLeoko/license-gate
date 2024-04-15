import { PUBLIC_BACKEND_URL } from '$env/static/public'
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import SuperJSON from 'superjson'
import type { AppRouter, RouterInput, RouterOutput } from '../../../backend/src/routers/_app'
import { logError } from './stores/alerts'
import { logout } from './stores/auth'

export type ReadMe = RouterOutput['auth']['me']

export type ReadLicense = RouterOutput['license']['read']
export type ListLicense = RouterOutput['license']['list']['licenses'][0]
export type LicenseStatusFilter = RouterInput['license']['list']['filterStatus']
export type CreateLicense = RouterInput['license']['create']
export type UpdateLicense = RouterInput['license']['update']

export type ReplenishInterval = NonNullable<ReadLicense['replenishInterval']>

export type ListLog = RouterOutput['logs']['list'][0]
export type ValidationResult = ListLog['result']

export type QuickStats = RouterOutput['logs']['quickStats']
export type HistogramData = RouterOutput['logs']['histogram']['histogram']

export type ListApiKey = RouterOutput['apiKey']['list'][0]

export const trpc = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
	links: [
		loggerLink({
			logger: (data) => {
				if (data.direction == 'down') {
					if (data.result instanceof Error) {
						if (data.result.message == 'error.notAuthenticated') {
							logError('Your session expired')
							logout()
						} else if (data.result.message.startsWith('+ ')) {
							logError(data.result.message.slice(2))
						} else {
							logError('An error occurred')
							console.error(data.result)
						}
					}
				}
			},
		}),
		httpBatchLink({
			url: PUBLIC_BACKEND_URL + '/trpc',
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include',
				})
			},
		}),
	],
})

export function nonTrpcFetch(path: string, options?: RequestInit) {
	return fetch(PUBLIC_BACKEND_URL + '/' + path, options).then(async (res) => {
		if (!res.ok) {
			// Is json?
			if (res.headers.get('content-type')?.startsWith('application/json')) {
				throw new Error((await res.json())?.message ?? res.statusText)
			} else {
				throw new Error(await res.text())
			}
		}

		return res
	})
}
