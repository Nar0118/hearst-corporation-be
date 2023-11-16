import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { RouteError } from '@src/other/classes'
import { contractRepository, machineRepository } from '@src/index'
import { Response } from 'express'
import logger from 'jet-logger'
import {
	Errors,
	SOMETHING_WENT_WRONG_ERR,
} from '../AuthRouts/auth.api.handlers'
import { AuthenticatedRequest } from '@src/middleware/AuthMiddleware'
import { Machine } from '@src/repos/entities/Machine'
import { PaginationRequest, getTotalPages } from '@src/middleware/PaginationMiddleware'
import { DEFAULT_PAGE_SIZE } from '@src/constants/constants'

const MACHINE_CREATE_FAILED_ERR = 'Machine creation failed!'
const MACHINE_NOT_FOUND_ERR = 'Machine not found!'
const MACHINE_UPDATE_FAILED_ERR = 'Machine update failed!'
const CONTRACT_NOT_FOUND_ERR = 'Contract not found!'

export const createMachine = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		const contract = await contractRepository.findOne({
			where: { id: req.body.contractId },
		})
		if (!contract) {
			res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ error: CONTRACT_NOT_FOUND_ERR })
			return
		}
		const machine = new Machine()
		machine.contract = contract
		Object.assign(machine, req.body)
		const persists = await machineRepository.save(machine)
		res.status(HttpStatusCodes.CREATED).json(persists)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: MACHINE_CREATE_FAILED_ERR })
	}
}

export const getMachines = async (req: PaginationRequest, res: Response) => {
	try {
		const take = Number(req?.query?.limit) || DEFAULT_PAGE_SIZE;
		const [machines, count] = await machineRepository.findAndCount({
			where: { contractId: +req.params.contractId },
			skip: take * (Number(req?.query?.pageNumber) - 1),
			take
		})
		const totalPages = getTotalPages(count, take)
		res.status(HttpStatusCodes.OK).json({
			machines,
			totalPages,
			currentPage: req.pageNumber
		})
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export async function editMachineById(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	const persists = await machineRepository.findOne({
		where: { id: +req.params.machineId },
	})
	if (!persists) {
		res.status(HttpStatusCodes.NOT_FOUND).json({ error: MACHINE_NOT_FOUND_ERR })
		return
	}

	try {
		Object.assign(persists, req.body)

		const updatedMachine = await machineRepository.save(persists)
		res.status(HttpStatusCodes.OK).json(updatedMachine)
	} catch (err) {
		console.error(err)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: MACHINE_UPDATE_FAILED_ERR })
	}
}

export const deleteMachineById = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		const machineId = req.params.machineId

		const machine = await machineRepository.findOne({
			where: { id: +machineId },
		})

		if (!machine) {
			throw new RouteError(HttpStatusCodes.NOT_FOUND, MACHINE_NOT_FOUND_ERR)
		}
		const deletedMachine = await machineRepository.remove(machine)

		res.status(HttpStatusCodes.OK).json(deletedMachine)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

// **** Export default **** //
export default {
	createMachine,
	getMachines,
	deleteMachineById,
	editMachineById,
} as const
