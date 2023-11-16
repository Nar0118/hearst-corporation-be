import * as Joi from 'joi'

export const dashboardSchema: Record<string, Joi.Schema> = {
	filtered: Joi.object().keys({
		startDate: Joi.date().iso(),
		endDate: Joi.date().iso().greater(Joi.ref('startDate')),
		contractIds: Joi.array(),
		machineIds: Joi.array(),
		contracts: Joi.array(),
	}),
}

export const dashboardSchemaContract: Record<string, Joi.Schema> = {
	filtered: Joi.object().keys({
		contractIds: Joi.array(),
		machineIds: Joi.array(),
		subAccountUserId: Joi.string(),
		subAccountApiKey: Joi.string(),
		subAccountApiSecret: Joi.string(),
		page: Joi.string(),
		pageSize: Joi.string(),
	}),
}


export const dashboardSchemaForHashrate: Record<string, Joi.Schema> = {
	filtered: Joi.object().keys({
		param: Joi.string(),
	}),
}