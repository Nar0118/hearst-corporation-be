/* eslint-disable @typescript-eslint/no-unused-vars */
import cron from 'node-cron'
import EnvVars from '@src/constants/EnvVars'
import AntPoolService from '@src/services/AntpoolApiService'
import logger from 'jet-logger'
import { getAllContracts } from '@src/routes/Contracts/contract.helper'

// Running every minute
export const minerCron = cron.schedule(
	`*/${EnvVars.Cron.TimeInterval} * * * *`,
	async () => {
		try {
			// should be taken all contracts and create dataMiners for getting the hashRate for each contract
			const contracts = await getAllContracts()
			if (!contracts || !contracts.length) {
				logger.warn(
					'There is no contract, Cronjob will not run the session for getting hashRate for this time!',
				)
				logger.warn(
					`Next session will be started after ${EnvVars.Cron.TimeInterval} minutes`,
				)
				return
			}
			for (const contract of contracts) {
				const antPoolService = new AntPoolService(
					contract.subAccountUserId,
					contract.subAccountApiKey,
					contract.subAccountApiSecret,
				)
				const {
					data: { data },
				} = await antPoolService.getHashRate()
				// TODO: save to database
			}
		} catch (err) {
			logger.err(err)
		}
	},
)
