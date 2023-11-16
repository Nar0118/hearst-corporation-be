import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import {
	contractRepository,
	machineRepository,
	userRepository,
} from '@src/index'
import { Response } from 'express'
import logger from 'jet-logger'
import {
	Errors,
	SOMETHING_WENT_WRONG_ERR,
} from '../AuthRouts/auth.api.handlers'
import { AuthenticatedRequest } from '@src/middleware/AuthMiddleware'
import AntPoolService from '@src/services/AntpoolApiService'
import { Machine } from '@src/repos/entities/Machine'
import { getRevenuesByDate } from '../Revenues/revenue.helper'
import { calculateSpeed } from './dashboard.helper'

export const dashboardFirstPart = async (req: AuthenticatedRequest, res: Response) => {
	const userId = req.user?.ownerId || req.user?.id
	const params = JSON.parse(req.query.param as any)
	const contracts = params.contracts || []

	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	const user = await userRepository.find({ where: { id: userId } })
	if (!user) {
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
		return
	}

	const startDate = new Date(params.startDate as string)
	const endDate = params.endDate
		? new Date(params.endDate as string)
		: new Date()

	const hashrateDataArray = []
	const startTime = startDate?.getTime()
	const endTime = endDate?.getTime()

	for (const contract of contracts as any) {
		const antPool = new AntPoolService(
			contract.subAccountUserId,
			contract.subAccountApiKey,
			contract.subAccountApiSecret,
		)
		const hashrateData1 = await antPool.getHashrateChartData()
		// const paymentHistory = await antPool.getPaymentHistory()

		if (!hashrateData1 || !hashrateData1?.dailyData) {
			continue
		}

		const charts = hashrateData1.dailyData
		for (const [index, chart] of charts.entries()) {
			const unit = chart.unit
			const dailyChartData = chart.poolSpeedBeanList
			const newArray = []
			for (const dailyData of dailyChartData) {
				if (dailyData.date >= startTime && dailyData.date <= endTime) {
					dailyData.speed = calculateSpeed(dailyData.speed, unit)
					newArray.push(dailyData)
				}
			}

			hashrateData1.dailyData[index].poolSpeedBeanList = newArray
		}

		hashrateDataArray.push(hashrateData1)
		// paymentHistoryArray.push(paymentHistory)
	}

	const dashboardInfo = {
		hashrateDataArray,
	}

	try {
		res.status(HttpStatusCodes.OK).json(dashboardInfo)
	} catch (err) {
		logger.err(err)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export const dashboard = async (req: AuthenticatedRequest, res: Response) => {
	const userId = req.user?.ownerId || req.user?.id

	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	const user = await userRepository.find({ where: { id: userId } })
	if (!user) {
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
		return
	}

	const startDate = new Date(req.query.startDate as string)
	const endDate = req.query.endDate
		? new Date(req.query.endDate as string)
		: new Date()

	const revenues = await getRevenuesByDate(startDate, endDate)

	// machines by machines ID
	let filteredMachines: Machine[] = []
	if (req.query.machineId) {
		filteredMachines = await machineRepository.find({
			where: { id: +req.query.machineId },
		})
	}

	const qb = contractRepository.createQueryBuilder('contract')
	qb.leftJoinAndSelect('contract.user', 'user').where('user.id = :id', {
		id: userId,
	})
	const [allContracts] = await qb.getManyAndCount()

	if (req.query.contractIds) {
		qb.andWhere('contract.subAccountUserId IN(:...ids)', {
			ids: req.query.contractIds,
		})
	}

	let machineIdFilter: string[] = []
	if (req.query.machineIds) {
		machineIdFilter = req.query.machineIds as string[]
		qb.andWhere('contract.machineType IN(:...machineTypes)', {
			machineTypes: machineIdFilter,
		})
	}
	const [contracts] = await qb.getManyAndCount()

	const contractIds = []
	// get machine by types
	const machineByMachineType = []
	// get machine types
	const machineTypes = []
	// get machine by location
	const machineByLocation: { location: string; machineNumber: number }[] = []

	// TODO: in future remove this and use same for which in line 73 to get same functionality optimized
	for (const contract of contracts as any) {
		contractIds.push({ id: contract.id })
		if (
			machineIdFilter.length > 0 &&
			!machineIdFilter.includes(contract.machineType)
		) {
			continue
		}
		machineByMachineType.push({
			machineType: contract.machineType,
			machineNumber: contract.numberOfMachines,
		})

		const locationAlreadyAdded = machineByLocation.find(
			(ml) => ml.location === contract.location,
		)
		if (locationAlreadyAdded) {
			locationAlreadyAdded.machineNumber += contract.numberOfMachines
		} else {
			machineByLocation.push({
				location: contract.location,
				machineNumber: contract.numberOfMachines,
			})
		}
		machineTypes.push({ machineType: contract.machineType })
	}
	const dashboardInfo = {
		machineByLocation,
		machineByMachineType,
		machineTypes,
		contractIds,
		contracts,
		allContracts,
		revenues,
		filteredMachines,
		weeklyRevenue: [
			{
				week_start_date: {
					value: '2023-01-29',
				},
				weekly_average: 0.07350000000000001,
			},
			{
				week_start_date: {
					value: '2023-02-05',
				},
				weekly_average: 0.07757142857142857,
			},
			{
				week_start_date: {
					value: '2023-02-12',
				},
				weekly_average: 0.08071428571428572,
			},
			{
				week_start_date: {
					value: '2023-02-19',
				},
				weekly_average: 0.07300000000000001,
			},
			{
				week_start_date: {
					value: '2023-02-26',
				},
				weekly_average: 0.07671428571428572,
			},
			{
				week_start_date: {
					value: '2023-03-05',
				},
				weekly_average: 0.063,
			},
			{
				week_start_date: {
					value: '2023-03-12',
				},
				weekly_average: 0.07457142857142858,
			},
			{
				week_start_date: {
					value: '2023-03-19',
				},
				weekly_average: 0.08700000000000001,
			},
			{
				week_start_date: {
					value: '2023-03-26',
				},
				weekly_average: 0.075,
			},
		],
		revenueAverages: {
			revenue_average: 0.07578333333333334,
			mined_average: 23.5,
			apy_average: 0.318,
		},
		totalMachineHashrate: {
			hashrate: 3561274.1477116444,
			count: 364,
		},
		lastMonthHashrate: [
			{
				avgHashrate: 377616775.2734788,
				dateTime: {
					value: '2023-01-20',
				},
			},
			{
				avgHashrate: 182689296.5602592,
				dateTime: {
					value: '2023-01-26',
				},
			},
			{
				avgHashrate: 314900452.19251287,
				dateTime: {
					value: '2023-01-31',
				},
			},
			{
				avgHashrate: 219798773.6476992,
				dateTime: {
					value: '2023-02-01',
				},
			},
			{
				avgHashrate: 419344662.4436935,
				dateTime: {
					value: '2023-02-03',
				},
			},
			{
				avgHashrate: 1007950554.8768196,
				dateTime: {
					value: '2023-02-05',
				},
			},
			{
				avgHashrate: 238584012.1750633,
				dateTime: {
					value: '2023-02-06',
				},
			},
			{
				avgHashrate: 560302263.3289307,
				dateTime: {
					value: '2023-02-07',
				},
			},
			{
				avgHashrate: 966476945.1028295,
				dateTime: {
					value: '2023-02-09',
				},
			},
			{
				avgHashrate: 706115537.2497525,
				dateTime: {
					value: '2023-02-10',
				},
			},
			{
				avgHashrate: 101332537.827655,
				dateTime: {
					value: '2023-02-11',
				},
			},
			{
				avgHashrate: 1003245715.2867296,
				dateTime: {
					value: '2023-02-12',
				},
			},
			{
				avgHashrate: 654403490.3522247,
				dateTime: {
					value: '2023-02-13',
				},
			},
			{
				avgHashrate: 599661039.5163937,
				dateTime: {
					value: '2023-02-14',
				},
			},
			{
				avgHashrate: 245843151.15635842,
				dateTime: {
					value: '2023-02-15',
				},
			},
			{
				avgHashrate: 718916112.9336795,
				dateTime: {
					value: '2023-02-16',
				},
			},
			{
				avgHashrate: 445055548.4855252,
				dateTime: {
					value: '2023-02-17',
				},
			},
			{
				avgHashrate: 86320310.001336,
				dateTime: {
					value: '2023-02-19',
				},
			},
			{
				avgHashrate: 405310925.2766428,
				dateTime: {
					value: '2023-02-20',
				},
			},
			{
				avgHashrate: 90073366.957916,
				dateTime: {
					value: '2023-02-22',
				},
			},
			{
				avgHashrate: 409834896.89716095,
				dateTime: {
					value: '2023-02-23',
				},
			},
			{
				avgHashrate: 1003015600.446195,
				dateTime: {
					value: '2023-02-24',
				},
			},
			{
				avgHashrate: 567647432.4158256,
				dateTime: {
					value: '2023-02-25',
				},
			},
			{
				avgHashrate: 900835716.3684373,
				dateTime: {
					value: '2023-02-27',
				},
			},
			{
				avgHashrate: 112591708.697394,
				dateTime: {
					value: '2023-02-28',
				},
			},
			{
				avgHashrate: 781901019.1678314,
				dateTime: {
					value: '2023-03-02',
				},
			},
			{
				avgHashrate: 798598220.2802147,
				dateTime: {
					value: '2023-03-03',
				},
			},
			{
				avgHashrate: 101332537.827655,
				dateTime: {
					value: '2023-03-04',
				},
			},
			{
				avgHashrate: 580615627.9255515,
				dateTime: {
					value: '2023-03-05',
				},
			},
			{
				avgHashrate: 266776554.1389792,
				dateTime: {
					value: '2023-03-07',
				},
			},
			{
				avgHashrate: 95702952.392785,
				dateTime: {
					value: '2023-03-08',
				},
			},
			{
				avgHashrate: 1006051998.4972599,
				dateTime: {
					value: '2023-03-10',
				},
			},
			{
				avgHashrate: 1005070518.5351979,
				dateTime: {
					value: '2023-03-11',
				},
			},
			{
				avgHashrate: 882582017.0895127,
				dateTime: {
					value: '2023-03-12',
				},
			},
			{
				avgHashrate: 517224135.83250153,
				dateTime: {
					value: '2023-03-13',
				},
			},
			{
				avgHashrate: 568833007.1907235,
				dateTime: {
					value: '2023-03-14',
				},
			},
			{
				avgHashrate: 84443781.523046,
				dateTime: {
					value: '2023-03-15',
				},
			},
			{
				avgHashrate: 359707651.1018399,
				dateTime: {
					value: '2023-03-17',
				},
			},
			{
				avgHashrate: 1003459994.4922265,
				dateTime: {
					value: '2023-03-18',
				},
			},
			{
				avgHashrate: 1008287569.4159895,
				dateTime: {
					value: '2023-03-19',
				},
			},
			{
				avgHashrate: 265721368.8142605,
				dateTime: {
					value: '2023-03-21',
				},
			},
			{
				avgHashrate: 1003900248.8498727,
				dateTime: {
					value: '2023-03-22',
				},
			},
			{
				avgHashrate: 224358661.50461453,
				dateTime: {
					value: '2023-03-23',
				},
			},
			{
				avgHashrate: 253152803.56750733,
				dateTime: {
					value: '2023-03-24',
				},
			},
			{
				avgHashrate: 551271211.1613756,
				dateTime: {
					value: '2023-03-25',
				},
			},
			{
				avgHashrate: 90542499.077488,
				dateTime: {
					value: '2023-03-26',
				},
			},
			{
				avgHashrate: 529136127.4247469,
				dateTime: {
					value: '2023-03-27',
				},
			},
			{
				avgHashrate: 533364454.76973414,
				dateTime: {
					value: '2023-03-28',
				},
			},
			{
				avgHashrate: 543669671.36625,
				dateTime: {
					value: '2023-03-29',
				},
			},
			{
				avgHashrate: 566954501.3913195,
				dateTime: {
					value: '2023-03-30',
				},
			},
			{
				avgHashrate: 83740083.343687,
				dateTime: {
					value: '2023-03-31',
				},
			},
			{
				avgHashrate: 635969091.8238333,
				dateTime: {
					value: '2023-04-01',
				},
			},
			{
				avgHashrate: 548030886.6628909,
				dateTime: {
					value: '2023-04-02',
				},
			},
			{
				avgHashrate: 127603936.523714,
				dateTime: {
					value: '2023-04-04',
				},
			},
			{
				avgHashrate: 576785387.905392,
				dateTime: {
					value: '2023-04-05',
				},
			},
			{
				avgHashrate: 442398634.8310639,
				dateTime: {
					value: '2023-04-07',
				},
			},
			{
				avgHashrate: 40798317.83782417,
				dateTime: {
					value: '2023-04-08',
				},
			},
			{
				avgHashrate: 181029958.1130099,
				dateTime: {
					value: '2023-04-09',
				},
			},
			{
				avgHashrate: 49883602.2851892,
				dateTime: {
					value: '2023-04-10',
				},
			},
			{
				avgHashrate: 40960599.9289338,
				dateTime: {
					value: '2023-04-12',
				},
			},
			{
				avgHashrate: 57519240.82453538,
				dateTime: {
					value: '2023-04-13',
				},
			},
			{
				avgHashrate: 47881116.35209554,
				dateTime: {
					value: '2023-04-14',
				},
			},
			{
				avgHashrate: 56663801.10914623,
				dateTime: {
					value: '2023-04-15',
				},
			},
			{
				avgHashrate: 55872715.574180886,
				dateTime: {
					value: '2023-04-16',
				},
			},
			{
				avgHashrate: 93871671.58946761,
				dateTime: {
					value: '2023-04-17',
				},
			},
			{
				avgHashrate: 51001778.262500055,
				dateTime: {
					value: '2023-04-18',
				},
			},
			{
				avgHashrate: 48503559.621855035,
				dateTime: {
					value: '2023-04-19',
				},
			},
		],
		lastMonthRevenue: [
			{
				revenue: 0.093,
			},
			{
				revenue: 0.087,
			},
			{
				revenue: 0.084,
			},
			{
				revenue: 0.084,
			},
			{
				revenue: 0.084,
			},
			{
				revenue: 0.081,
			},
			{
				revenue: 0.081,
			},
			{
				revenue: 0.081,
			},
			{
				revenue: 0.078,
			},
			{
				revenue: 0.075,
			},
			{
				revenue: 0.075,
			},
			{
				revenue: 0.075,
			},
			{
				revenue: 0.072,
			},
			{
				revenue: 0.072,
			},
			{
				revenue: 0.069,
			},
			{
				revenue: 0.069,
			},
			{
				revenue: 0.066,
			},
			{
				revenue: 0.092,
			},
			{
				revenue: 0.089,
			},
			{
				revenue: 0.059,
			},
			{
				revenue: 0.059,
			},
			{
				revenue: 0.086,
			},
			{
				revenue: 0.086,
			},
			{
				revenue: 0.083,
			},
			{
				revenue: 0.083,
			},
			{
				revenue: 0.083,
			},
			{
				revenue: 0.056,
			},
			{
				revenue: 0.08,
			},
			{
				revenue: 0.08,
			},
			{
				revenue: 0.077,
			},
			{
				revenue: 0.053,
			},
			{
				revenue: 0.106,
			},
			{
				revenue: 0.074,
			},
			{
				revenue: 0.074,
			},
			{
				revenue: 0.074,
			},
			{
				revenue: 0.074,
			},
			{
				revenue: 0.074,
			},
			{
				revenue: 0.074,
			},
			{
				revenue: 0.074,
			},
			{
				revenue: 0.071,
			},
			{
				revenue: 0.071,
			},
			{
				revenue: 0.068,
			},
			{
				revenue: 0.068,
			},
			{
				revenue: 0.068,
			},
			{
				revenue: 0.088,
			},
			{
				revenue: 0.085,
			},
			{
				revenue: 0.057,
			},
			{
				revenue: 0.082,
			},
			{
				revenue: 0.079,
			},
			{
				revenue: 0.079,
			},
			{
				revenue: 0.076,
			},
			{
				revenue: 0.076,
			},
			{
				revenue: 0.073,
			},
			{
				revenue: 0.073,
			},
			{
				revenue: 0.073,
			},
			{
				revenue: 0.073,
			},
			{
				revenue: 0.07,
			},
			{
				revenue: 0.067,
			},
			{
				revenue: 0.067,
			},
			{
				revenue: 0.067,
			},
		],
	}

	try {
		res.status(HttpStatusCodes.OK).json(dashboardInfo)
	} catch (err) {
		logger.err(err)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export const getPaymentHistory = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.ownerId || req.user?.id

	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		const qb = contractRepository.createQueryBuilder('contract')
		qb.leftJoinAndSelect('contract.user', 'user').where('user.id = :id', {
			id: userId,
		})
		if (req.query.contractIds) {
			qb.andWhere('contract.subAccountUserId IN(:...ids)', {
				ids: req.query.contractIds,
			})
		}
		let machineIdFilter: string[] = []
		if (req.query.machineIds) {
			machineIdFilter = req.query.machineIds as string[]
			qb.andWhere('contract.machineType IN(:...machineTypes)', {
				machineTypes: machineIdFilter,
			})
		}
		const [contracts] = await qb.getManyAndCount()

		if (!contracts) {
			res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ error: "Contract doesn't exist" })
		}
		res.status(HttpStatusCodes.OK).json([])
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export const getAllPaymentHostory = async (
	req: AuthenticatedRequest,
	res: Response,
) => {

	let page = 1;
	let totalPage = 1;
	if (
		!req?.query?.subAccountUserId ||
		!req?.query?.subAccountApiKey ||
		!req?.query?.subAccountApiSecret
	) {
		return res.status(HttpStatusCodes.BAD_REQUEST)
	}

	const antPool = new AntPoolService(
		req.query.subAccountUserId as string,
		req.query.subAccountApiKey as string,
		req.query.subAccountApiSecret as string,
	)
	let allPaymentHistory: any[] = []

	try {
		while (totalPage) {
			const data = await antPool.getPaymentHistory(page, 50)
			if (!data) {
				break;
			}
			allPaymentHistory = [...allPaymentHistory, ...data.rows]
			totalPage++;
			if (totalPage > data.totalPage) {
				break;
			}
			page++;
		}

		return res.status(HttpStatusCodes.OK).json(allPaymentHistory)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}

	return allPaymentHistory
}

// **** Export default **** //
export default {
	dashboard,
	getPaymentHistory,
	getAllPaymentHostory,
} as const
