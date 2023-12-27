export class CommonError extends Error {
	public override message: string
	public status: number

	constructor(message = 'internal server error', status = 500) {
		super(message)
		this.message = message
		this.status = status
	}

	toJSON() {
		return {
			message: this.message,
			status: this.status
		}
	}
}
export class BadRequestError extends CommonError {
	constructor(message = 'bad request') {
		super(message, 400)
	}
}
export class UnauthorizedError extends CommonError {
	constructor(message = 'unauthorized') {
		super(message, 401)
	}
}
export class ForbiddenError extends CommonError {
	constructor(message = 'forbidden') {
		super(message, 403)
	}
}
export class NotFoundError extends CommonError {
	constructor(message = 'not found') {
		super(message, 404)
	}
}

export class ConflictError extends CommonError {
	constructor(message = 'conflict') {
		super(message, 409)
	}
}

export class TooManyRequestsError extends CommonError {
	constructor(message = 'too many requests') {
		super(message, 429)
	}
}
export class InternalServerError extends CommonError {
	constructor(message = 'internal server error') {
		super(message, 500)
	}
}
