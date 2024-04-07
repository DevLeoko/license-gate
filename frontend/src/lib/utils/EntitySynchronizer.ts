import { get, type Writable } from 'svelte/store'

type IdType = number | string
type PartialWithId<T> = Partial<T> & { id: IdType }

type EntitySynchronizerEntry<T> = {
	syncProperties: (keyof T)[]
	store: Writable<PartialWithId<T>>
	onRemove?: () => void
}

type EntitySynchronizerArrayEntry<T> = {
	syncProperties: (keyof T)[]
	entity: Writable<PartialWithId<T>[]>
}

export class EntitySynchronizer<T extends { id: IdType }> {
	private entities: Map<IdType, EntitySynchronizerEntry<T>[]> = new Map()
	private arrayEntities: EntitySynchronizerArrayEntry<T>[] = []

	subscribeToChanges(
		entity: Writable<PartialWithId<T>>,
		syncProperties: (keyof T)[],
		onRemove?: () => void,
	) {
		const id = get(entity).id
		if (!this.entities.has(id)) {
			this.entities.set(id, [])
		}

		const entry = {
			store: entity,
			syncProperties,
			onRemove,
		}

		this.entities.get(id)!.push(entry)
		const unsubscribeChangeListener = entity.subscribe((value) => {
			this.onEntityChange(value, syncProperties, entry)
		})

		return () => {
			unsubscribeChangeListener()
			const entries = this.entities.get(id)
			const index = entries?.indexOf(entry)
			if (index !== undefined && index !== -1) {
				entries!.splice(index, 1)

				if (entries!.length === 0) {
					this.entities.delete(id)
				}
			}
		}
	}

	subscribeArrayToChanges(entity: Writable<PartialWithId<T>[]>, syncProperties: (keyof T)[]) {
		const entry = {
			entity,
			syncProperties,
		}

		this.arrayEntities.push(entry)
		const unsubscribeChangeListener = entity.subscribe((value) => {
			this.onArrayEntityChange(value, syncProperties, entry)
		})

		return () => {
			unsubscribeChangeListener()
			const index = this.arrayEntities.indexOf(entry)
			if (index !== undefined && index !== -1) {
				this.arrayEntities.splice(index, 1)
			}
		}
	}

	notifyRemoved(id: IdType) {
		const entries = this.entities.get(id)
		if (!entries) return

		// Notify single entities
		for (const entry of entries) {
			if (entry.onRemove) {
				entry.onRemove()
			}
		}

		// Remove from array entities
		for (const arrayEntry of this.arrayEntities) {
			if (!get(arrayEntry.entity).some((entity) => entity.id === id)) continue

			arrayEntry.entity.update((value) => {
				return value.filter((entity) => entity.id !== id)
			})
		}

		// this.entities.delete(id)
	}

	private onArrayEntityChange(
		entities: PartialWithId<T>[],
		syncProperties: (keyof T)[],
		sourceEntry: EntitySynchronizerArrayEntry<T>,
	) {
		for (const entity of entities) {
			this.onEntityChange(entity, syncProperties, sourceEntry)
		}
	}

	private onEntityChange(
		entity: PartialWithId<T>,
		syncProperties: (keyof T)[],
		sourceEntry: EntitySynchronizerEntry<T> | EntitySynchronizerArrayEntry<T>,
	) {
		const id = entity.id
		const entries = this.entities.get(id)
		if (!entries) return

		for (const entry of entries) {
			if (entry === sourceEntry) continue

			this.alignEntries({ syncProperties, entity }, entry)
		}

		// This is very inefficient
		for (const arrayEntry of this.arrayEntities) {
			if (arrayEntry === sourceEntry) continue

			this.alignArrayEntries({ syncProperties, entity }, arrayEntry)
		}

		console.log('Alligned all entities', syncProperties.length)
	}

	private alignEntries(
		source: {
			syncProperties: (keyof T)[]
			entity: PartialWithId<T>
		},
		target: {
			syncProperties: (keyof T)[]
			store: Writable<PartialWithId<T>>
		},
	) {
		console.log('Aligning', source, target)

		const sourceEntity = source.entity
		const targetEntity = get(target.store)

		const sharedProperties = source.syncProperties.filter((key) =>
			target.syncProperties.includes(key),
		)
		if (sharedProperties.length === 0) return

		let hasChanged = false
		for (const key of sharedProperties) {
			if (sourceEntity[key] !== targetEntity[key]) {
				hasChanged = true
				break
			}
		}

		if (hasChanged) {
			target.store.update((value) => {
				for (const key of sharedProperties) {
					value[key] = sourceEntity[key]
				}
				return value
			})
		}
	}

	private alignArrayEntries(
		source: {
			syncProperties: (keyof T)[]
			entity: PartialWithId<T>
		},
		target: EntitySynchronizerArrayEntry<T>,
	) {
		const sourceEntity = source.entity
		const targetEntities = get(target.entity)

		const sharedProperties = source.syncProperties.filter((key) =>
			target.syncProperties.includes(key),
		)

		let hasChanged = false
		for (const targetEntity of targetEntities) {
			if (targetEntity.id !== sourceEntity.id) continue

			for (const key of sharedProperties) {
				if (sourceEntity[key] !== targetEntity[key]) {
					hasChanged = true
					break
				}
			}
		}

		if (hasChanged) {
			target.entity.update((value) => {
				for (const targetEntity of value) {
					if (targetEntity.id !== sourceEntity.id) continue

					for (const key of sharedProperties) {
						targetEntity[key] = sourceEntity[key]
					}
				}

				return value
			})
		}
	}
}
