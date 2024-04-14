export type Expand<T> = { [K in keyof T]: T[K] };
