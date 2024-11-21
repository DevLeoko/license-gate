import type { ReadDevice } from '../trpcClient'
import { EntitySynchronizer } from '../utils/EntitySynchronizer'

const deviceSynchronizer = new EntitySynchronizer<ReadDevice>()

export const syncDevice = deviceSynchronizer.subscribeToChanges.bind(deviceSynchronizer)
export const syncDevices = deviceSynchronizer.subscribeArrayToChanges.bind(deviceSynchronizer)
export const notifyDeviceRemoved = deviceSynchronizer.notifyRemoved.bind(deviceSynchronizer)
