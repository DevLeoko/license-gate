export type NullableProp<T, K extends keyof T> = {
	[P in K]: T[P] | null
} & Omit<T, K>
