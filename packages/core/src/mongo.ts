// export * as Mongo from "./mongo";
import { randomUUID } from 'crypto'
import {
	connect,
	Connection,
	FilterQuery,
	Model,
	Schema,
	SchemaDefinition,
	SchemaOptions,
	model as BuildModel,
	UpdateQuery,
	UpdateWriteOpResult,
	PipelineStage,
	AggregateOptions
} from 'mongoose'
import { BaseModel, Options, PaginationOptions, Projection } from './types/mongo'
import { Config } from "sst/node/config";
import { NotFoundError } from "./types/errors";


let cachedConnection: Connection | null = null

export async function createConnection() {
	if (cachedConnection) {
		return cachedConnection
	}
	const { connection } = await connect(Config.MONGO_URI, {
		autoCreate: true,
		autoIndex: true,
		maxIdleTimeMS: 3000,
		socketTimeoutMS: 30000,
		serverSelectionTimeoutMS: 5000,
		maxPoolSize: 5
	})
	cachedConnection = connection
	return connection
}

export class Collection<T extends BaseModel> {
	public model: Model<T>
	public collectionName: string

	constructor(
		collectionName: string,
		schemaDefinition: SchemaDefinition<T>,
		options: {
			// eslint-disable-next-line no-unused-vars
			configure?: (schema: Schema<T>) => void
		} = {},
		schemaOptions?: SchemaOptions
	) {
		this.collectionName = collectionName
		const schema = new Schema(
			{
				_id: {
					type: String,
					default: () => randomUUID()
				},
				...schemaDefinition
			},
			{
				timestamps: {
					createdAt: 'created_at',
					updatedAt: 'updated_at'
				},
				...schemaOptions
			}
		)
		schema.virtual('id').get(function () {
			return this._id
		})
		schema.set('toJSON', {
			virtuals: true,
			getters: true,
			transform: (_, doc) => {
				// strip mongo specific fields
				doc._id = doc.__v = undefined
				return doc
			}
		})
		options.configure?.(schema)
		this.model = BuildModel<T>(collectionName, schema)
	}

	public async read(
		filter?: FilterQuery<T>,
		options?: Options<T>,
		projection?: Projection
	): Promise<T> {
		const doc = await this.model.findOne(filter, projection, options)
		if (!doc) throw new NotFoundError(`no ${this.model.modelName} found`)
		return doc
	}

	public async find(
		filter?: FilterQuery<T>,
		options?: Options<T>,
		projection?: Projection
	): Promise<T | null> {
		return await this.model.findOne(filter, projection, options)
	}

	public async list(
		filter?: FilterQuery<T>,
		options?: Options<T>,
		projection?: Projection
	): Promise<T[] | []> {
		return this.model.find(filter ?? {}, projection, options)
	}

	public async bulkInsert(docs: Partial<T>[]): Promise<T[]> {
		return this.model.insertMany(docs) as unknown as T[]
	}

	public async insertOne(doc: Partial<T>): Promise<T> {
		return this.model.create(doc)
	}

	public async count(filter: FilterQuery<T>, options?: Options<T>) {
		return this.model.countDocuments(filter, options)
	}

	public async exists(filter: FilterQuery<T>, options?: Options<T>) {
		return (await this.count(filter, options)) >= 1
	}

	public async updateOne(
		filter: FilterQuery<T>,
		updates: UpdateQuery<T>,
		options?: Options<T>
	): Promise<T> {
		return this.model.findOneAndUpdate(filter, updates, {
			new: true,
			...options
		}) as unknown as T
	}

	public async bulkUpdate(
		filter: FilterQuery<T>,
		updates: UpdateQuery<T>
	): Promise<UpdateWriteOpResult> {
		return this.model.updateMany(filter, updates, { new: true })
	}

	public async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
		return this.model.findOneAndDelete(filter)
	}

	public async aggregate<T>(pipeline: PipelineStage[], options?: AggregateOptions) {
		return this.model.aggregate(pipeline, options) as unknown as T
	}

	public async paginate(filter: FilterQuery<T>, options?: PaginationOptions<T>) {
		const limit = options?.limit ?? 5
		const page = options?.page ?? 1
		const paginationOptions = {
			page,
			skip: (page - 1) * limit,
			limit,
			...options
		}
		const [count, items] = await Promise.all([
			this.count(filter),
			this.list(filter, paginationOptions)
		])
		return {
			pages: Math.ceil(count / limit),
			items
		}
	}
}
