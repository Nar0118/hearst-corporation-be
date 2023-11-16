/* eslint-disable @typescript-eslint/no-unused-vars */
import cron from 'node-cron'
import AntPoolService from '@src/services/AntpoolApiService'
import logger from 'jet-logger'
import { contractRepository } from '..'

// Running every first day of month
export const lastMonthMined = cron.schedule(`0 0 1 * *`, async () => {
	try {
		const qb = contractRepository.createQueryBuilder('contract')
		const [allContracts] = await qb.getManyAndCount()

		for (let i = 0; i < allContracts.length; i++) {
			let allPaymentHistory: any[] = []
			let page = 1
			let totalPage = 1
			const contract = allContracts[i]

			const antPool = new AntPoolService(
				contract.subAccountUserId as string,
				contract.subAccountApiKey as string,
				contract.subAccountApiSecret as string,
			)

			while (totalPage) {
				const data = await antPool.getPaymentHistory(page, 50)
				if (!data) {
					break
				}
				allPaymentHistory = [...allPaymentHistory, ...data.rows]
				totalPage++
				if (totalPage > data.totalPage) {
					break
				}
				page++
			}

			const currentDate = new Date()
			const lastMonth = currentDate.getMonth() - 1

			const filteredArray = allPaymentHistory.filter((item) => {
				const itemDate = new Date(item.timestamp)
				return itemDate.getMonth() === lastMonth
			})
			let lastMonthMined: number = 0

			filteredArray.map((e: any) => {
				if (
					typeof e.ppapplnsAmount === 'string' &&
					typeof e.ppappsAmount === 'string'
				) {
					lastMonthMined += Number(e.ppapplnsAmount) + Number(e.ppappsAmount)
				} else {
					lastMonthMined += e.ppapplnsAmount + e.ppappsAmount
				}
			})

			const necessaryContract = await contractRepository.findOne({})
			if (necessaryContract) {
				const prevLastMonthMined = Number(necessaryContract.lastMonthMined)
				const newPercent =
					((lastMonthMined - prevLastMonthMined) / lastMonthMined) * 100
				necessaryContract.lastMonthMinedPercent = newPercent.toString()
				necessaryContract.lastMonthMined = lastMonthMined.toString()
				await contractRepository.save(necessaryContract)
			}
		}
	} catch (err) {
		logger.err(err)
	}
})
