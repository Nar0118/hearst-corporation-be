import logger from 'jet-logger'
import { contractRepository } from '@src/index'

export const getAllContracts = async () => {
	try {
		const contracts = await contractRepository.find()
		if (!contracts.length) {
			return
		}
		return contracts
	} catch (err) {
		logger.err(err)
		return
	}
}

// **** Export default **** //
export default {
	getAllContracts,
} as const
