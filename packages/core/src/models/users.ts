import { BaseModel } from '../types/mongo'
import { BadRequestError, UnauthorizedError } from '../types/errors'
import { Collection } from '../mongo'

export interface User extends BaseModel {
	phone: string
	email?: string
	first_name?: string
	last_name?: string
}

type RegisterUser = Pick<User, 'email'>

class UsersCollection extends Collection<User> {
	constructor() {
		super('users', {
			first_name: {
				type: String,
				default: null
			},
			last_name: {
				type: String,
				default: null
			},
			email: {
				type: String,
				default: null
			},
			phone: {
				type: String,
				required: true
			}
		}, {
			configure(schema) {
				schema.index({ phone: 1 }, { unique: true })
			}
		})
	}

	async findOrCreateByPhone(phone: string): Promise<User> {
		let user = await this.find({ phone });

		if (!user) {
			user = await this.insertOne({ phone });
		}

		return user;
	}
}

export const users = new UsersCollection()
