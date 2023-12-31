import * as Joi from 'joi'

const contractSchema: Record<string, Joi.Schema> = {
	createSchema: Joi.object().keys({
		customerEmail: Joi.string().required(),
		contractStartingDate: Joi.date(),
		timeToPlug: Joi.date(),
		plugDate: Joi.date(),
		subAccountUserId: Joi.string(),
		subAccountApiKey: Joi.string(),
		subAccountApiSecret: Joi.string(),
		machineType: Joi.string().required(),
		contractStatus: Joi.string().required(),
		machineNumber: Joi.number(), // TODO: Duplicate we have already numberOfMachines
		machineWatt: Joi.number().required(),
		machineTH: Joi.number().required(),
		electricityCost: Joi.number().required(),
		minersCost: Joi.number().required(),
		location: Joi.string().required(),
		hostingCost: Joi.number().required(),
		hostingCompany: Joi.string().required(),
		machineSupplier: Joi.string().required(),
		totalInvestment: Joi.number().required(),
		hearstUpfront: Joi.number().required(),
		numberOfMachines: Joi.number().required(),
		yearToCapitalConstitution: Joi.number().required(),
		hashRate: Joi.number().required(),
		hashRatePercent: Joi.number().required(),
		lastMonthMined: Joi.number().required(),
		lastMonthRevenue: Joi.number().required(),
		lastMonthApy: Joi.number().required(),
		lastMonthMinedPercent: Joi.number().required(),
		lastMonthRevenuePercent: Joi.number().required(),
		lastMonthApyPercent: Joi.number().required(),
		monthlyElectricityCost: Joi.number(),
	}),
	updateSchema: Joi.object().keys({
		customerEmail: Joi.string().required(),
		contractStartingDate: Joi.date(),
		timeToPlug: Joi.date(),
		plugDate: Joi.date(),
		subAccountUserId: Joi.string(),
		subAccountApiKey: Joi.string(),
		subAccountApiSecret: Joi.string(),
		machineType: Joi.string().required(),
		contractStatus: Joi.string().required(),
		machineNumber: Joi.number(), // TODO: Duplicate we have already numberOfMachines
		machineWatt: Joi.number().required(),
		machineTH: Joi.number().required(),
		electricityCost: Joi.number().required(),
		minersCost: Joi.number().required(),
		location: Joi.string().required(),
		hostingCost: Joi.number().required(),
		hostingCompany: Joi.string().required(),
		machineSupplier: Joi.string().required(),
		totalInvestment: Joi.number().required(),
		hearstUpfront: Joi.number().required(),
		numberOfMachines: Joi.number().required(),
		yearToCapitalConstitution: Joi.number().required(),
		hashRate: Joi.number().required(),
		hashRatePercent: Joi.number().required(),
		lastMonthMined: Joi.number().required(),
		lastMonthRevenue: Joi.number().required(),
		lastMonthApy: Joi.number().required(),
		lastMonthMinedPercent: Joi.number().required(),
		lastMonthRevenuePercent: Joi.number().required(),
		lastMonthApyPercent: Joi.number().required(),
		monthlyElectricityCost: Joi.number(),
	}),
}

export default contractSchema
