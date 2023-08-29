import type { ReplenishInterval } from '../trpcClient'

export function replenishIntervalToString(replenishInterval: ReplenishInterval) {
	switch (replenishInterval) {
		case 'TEN_SECONDS':
			return '10 seconds'
		case 'MINUTE':
			return 'minute'
		case 'HOUR':
			return 'hour'
		case 'DAY':
			return 'day'
	}
}
