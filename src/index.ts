import './pre-start' // Must be the first import
import logger from 'jet-logger'
import EnvVars from '@src/constants/EnvVars'
import server from './server'
import crons from './crons'
import { AppDataSource } from './repos/database/config'
import { User } from './repos/entities/User'
import { Contract } from './repos/entities/Contract'
import { Machine } from './repos/entities/Machine'
import { MachineRate } from './repos/entities/MachineRate'
import { Revenue } from './repos/entities/Revenue'

const SERVER_START_MSG =
	'Express server started on port: ' + EnvVars.Port.toString()
const CRON_START_MSG = 'Cron started successfully!'
const CRON_START_ERR = 'Running the cron failed!'

export const userRepository = AppDataSource.getRepository(User)
export const contractRepository = AppDataSource.getRepository(Contract)
export const revenueRepository = AppDataSource.getRepository(Revenue)
export const machineRepository = AppDataSource.getRepository(Machine)
export const machineRateRepository = AppDataSource.getRepository(MachineRate)

const start = async () => {
	try {
		crons.forEach((cron) => {
			cron.start()
		})
		logger.info(CRON_START_MSG)
	} catch (err) {
		logger.warn(CRON_START_ERR)
		logger.err(err)
	}
	await AppDataSource.initialize()
	logger.info('Database connected!')
	server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG))
}

// **** Run **** //
start()
