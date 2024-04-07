import type { ReadLicense } from '../trpcClient'
import { EntitySynchronizer } from '../utils/EntitySynchronizer'

const licenseSynchronizer = new EntitySynchronizer<ReadLicense>()

export const syncLicense = licenseSynchronizer.subscribeToChanges.bind(licenseSynchronizer)
export const syncLicenses = licenseSynchronizer.subscribeArrayToChanges.bind(licenseSynchronizer)
export const notifyLicenseRemoved = licenseSynchronizer.notifyRemoved.bind(licenseSynchronizer)
