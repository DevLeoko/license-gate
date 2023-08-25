import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query'
import {
	trpc,
	type CreateLicense,
	type LicenseStatusFilter,
	type UpdateLicense,
} from '../../trpcClient'

const LICENSE_KEYS = {
	all: ['license'],
	allRead: ['license', 'read'],
	read: (id: number) => [...LICENSE_KEYS.allRead, id],
	allList: ['license', 'list'],
	list: (take: number, skip: number, filterStatus?: string) => [
		...LICENSE_KEYS.allList,
		take,
		skip,
		filterStatus,
	],
}

export function createLicenseReadQuery(id: number) {
	return createQuery({
		queryKey: LICENSE_KEYS.read(id),
		queryFn: () => trpc.license.read.query({ id }),
	})
}

export function createLicenseListQuery(
	take: number,
	skip: number,
	filterStatus?: LicenseStatusFilter,
) {
	return createQuery({
		queryKey: LICENSE_KEYS.list(take, skip, filterStatus),
		queryFn: () => trpc.license.list.query({ take, skip, filterStatus }),
	})
}

export function createLicenseCreateMutation() {
	const queryClient = useQueryClient()
	return createMutation({
		mutationFn: async (licenseData: CreateLicense) => {
			return await trpc.license.create.mutate(licenseData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries(LICENSE_KEYS.allList)
		},
	})
}

export function createLicenseUpdateMutation() {
	const queryClient = useQueryClient()
	return createMutation({
		mutationFn: async (licenseData: UpdateLicense) => {
			return await trpc.license.update.mutate(licenseData)
		},
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries(LICENSE_KEYS.allList)
			queryClient.invalidateQueries(LICENSE_KEYS.read(id))
		},
	})
}

export function createLicenseDeleteMutation() {
	const queryClient = useQueryClient()
	return createMutation({
		mutationFn: async (id: number) => {
			return await trpc.license.delete.mutate({ id })
		},
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries(LICENSE_KEYS.allList)
			queryClient.invalidateQueries(LICENSE_KEYS.read(id))
		},
	})
}
