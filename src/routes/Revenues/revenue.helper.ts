import { revenueRepository } from '@src/index'
import logger from 'jet-logger'

export const getRevenuesByDate = async (startDate: Date, endDate: Date) => {
	try {
		const qb = revenueRepository.createQueryBuilder('revenue')

		if (startDate && endDate) {
			qb.where('revenue.date BETWEEN :startDate AND :endDate', {
				startDate,
				endDate,
			})
		} else if (startDate) {
			qb.where('revenue.date >= :startDate', { startDate })
		} else if (endDate) {
			qb.where('revenue.date <= :endDate', { endDate })
		}
		const revenues = await qb.getMany()
		return revenues
	} catch (err) {
		logger.err(err)
		return
	}
}

// **** Export default **** //
export default {
	getRevenuesByDate,
} as const
