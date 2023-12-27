import type { PopulateOptions, QueryOptions } from 'mongoose'

export type Projection = Record<string, 0 | 1>

export interface BaseModel {
	_id: string
	id: string
	updated_at: Date
	created_at: Date
}

export type Ref<T> = T | string

export interface Options<T extends BaseModel> extends QueryOptions {
	sort?: {
		// eslint-disable-next-line no-unused-vars
		[k in keyof Partial<T>]: 1 | -1 | number;
	};
	populate?: PopulateOptions[];
	limit?: number;
	skip?: number;
	new?: boolean;
}

export interface PaginationOptions<T extends BaseModel> extends Options<T> {
	page: number;
}
