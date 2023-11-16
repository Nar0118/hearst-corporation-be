import * as Joi from 'joi'

const revenueSchema: Record<string, Joi.Schema> = {
	createSchema: Joi.object().keys({
		weeklyAverage: Joi.string(),
		dailyAverage: Joi.string(),
		date: Joi.date(),
	}),
	updateSchema: Joi.object().keys({
		weeklyAverage: Joi.string(),
		dailyAverage: Joi.string(),
		date: Joi.date(),
	}),
}

export default revenueSchema
