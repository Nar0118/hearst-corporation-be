import * as Joi from 'joi'

const machineSchema: Record<string, Joi.Schema> = {
	getByContractIdSchema: Joi.object().keys({
		contractId: Joi.number().required(),
	}),
	createSchema: Joi.object().keys({
		name: Joi.string().required(),
		accepted: Joi.string().required(),
		stale: Joi.string().required(),
		other: Joi.string().required(),
		contractId: Joi.number().required(),
	}),
	updateMachine: Joi.object().keys({
		name: Joi.string().required(),
		accepted: Joi.string().required(),
		stale: Joi.string().required(),
		other: Joi.string().required(),
		contractId: Joi.number().required(),
	}),
}

export default machineSchema
