import * as Joi from 'joi'

const allowedRoles = ['Admin', 'Customer',]

const userSchema: Record<string, Joi.Schema> = {
	userAccount: Joi.object().keys({
		email: Joi.string().required(),
		companyName: Joi.string(),
		role: Joi.string().valid(...allowedRoles),
		username: Joi.string(),
		password: Joi.string().min(5).max(16).required(),
		picture: Joi.string(),
		lastName: Joi.string(),
		firstName: Joi.string(),
	}),
	userUpdate: Joi.object().keys({
		newEmail: Joi.string(),
		role: Joi.string().valid(...allowedRoles),
		companyName: Joi.string(),
		email: Joi.string(),
		username: Joi.string(),
		picture: Joi.string(),
		lastName: Joi.string(),
		firstName: Joi.string(),
	}),
	userSubAccount: Joi.object().keys({
		email: Joi.string().required(),
		companyName: Joi.string(),
		role: Joi.string().valid('SubAccount'),
		username: Joi.string(),
		password: Joi.string().min(5).max(16).required(),
		picture: Joi.string(),
		lastName: Joi.string(),
		firstName: Joi.string(),
		ownerId: Joi.number().required(),
	}),

	userSubAccountUpdate: Joi.object().keys({
		newEmail: Joi.string(),
		role: Joi.string().valid('SubAccount'),
		companyName: Joi.string(),
		email: Joi.string(),
		username: Joi.string(),
		picture: Joi.string(),
		lastName: Joi.string(),
		firstName: Joi.string(),
		ownerId: Joi.number().required()
	}),
}

export default userSchema
