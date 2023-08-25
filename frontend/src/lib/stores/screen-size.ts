import { derived, readable } from 'svelte/store'

export const screenWith = readable(window.innerWidth, (set) => {
	const handler = () => set(window.innerWidth)
	window.addEventListener('resize', handler)
	return () => window.removeEventListener('resize', handler)
})

export const isMdOrLarger = derived(screenWith, ($screenWith) => $screenWith >= 768)
