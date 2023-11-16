import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { RouteError } from '@src/other/classes'
import { contractRepository, userRepository } from '@src/index'
import { Response } from 'express'
import logger from 'jet-logger'
import {
	Errors,
	SOMETHING_WENT_WRONG_ERR,
} from '../AuthRouts/auth.api.handlers'
import { AuthenticatedRequest } from '@src/middleware/AuthMiddleware'
import { Contract } from '@src/repos/entities/Contract'
import { Roles } from '@src/repos/entities/User'
import { USER_NOT_FOUND_ERR } from '../UserRouts/user.api.handlers'
import { DEFAULT_PAGE_SIZE } from '@src/constants/constants'
import {
	getTotalPages,
	PaginationRequest,
} from '@src/middleware/PaginationMiddleware'

const CONTRACT_CREATE_FAILED_ERR = 'Contract creation failed!'
const CONTRACT_NOT_FOUND_ERR = 'Contract not found!'
const CUSTOMER_NOT_FOUND_ERR = 'Customer not found!'
const CONTRACT_UPDATE_FAILED_ERR = 'Contract update failed!'

export const createContract = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	const user = await userRepository.findOne({ where: { id: userId } })

	if (!user || user?.role !== Roles.Admin) {
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
		return
	}
	const customerEmail = req.body.customerEmail
	const customer = await userRepository.findOne({
		where: { email: customerEmail },
	})
	if (!customer) {
		res
			.status(HttpStatusCodes.BAD_REQUEST)
			.json({ error: CUSTOMER_NOT_FOUND_ERR })
		return
	}

	try {
		const contract = new Contract()
		Object.assign(contract, req.body)
		contract.user = customer
		const persists = await contractRepository.save(contract)
		res.status(HttpStatusCodes.CREATED).json(persists)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: CONTRACT_CREATE_FAILED_ERR })
	}
}

export const getContracts = async (req: PaginationRequest, res: Response) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		if (req?.query?.search) {
			const query = req.query.search
			const queryBuilder = contractRepository.createQueryBuilder('contract')
			queryBuilder.where(
				'contract.subAccountUserId LIKE :term OR contract.machineType LIKE :term OR contract.Location LIKE :term',
				{
					term: `%${query}%`,
				},
			)
			const contracts = await queryBuilder.getMany()

			const take = Number(req?.query?.limit) || DEFAULT_PAGE_SIZE;
	     	const totalPages = getTotalPages(contracts.length, take);

			return res.status(HttpStatusCodes.CREATED).json({
				contracts,
				totalPages,
				currentPage: req.pageNumber,
			});		}
		const take = Number(req?.query?.limit) || DEFAULT_PAGE_SIZE;
		
		const [contracts, count] = await contractRepository.findAndCount({
			skip: req.skip,
			take,
			relations: ['user'],
			order: {
				id: 'asc',
			},
		})

		const totalPages = getTotalPages(count, take)

		for (const contract of contracts) {
			(contract as any).customerEmail = contract.user.email
		}

		res
			.status(HttpStatusCodes.OK)
			.json({ contracts, totalPages, currentPage: req.pageNumber })
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export const getContractsById = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		const contractId = req.params.id
		const contracts = await contractRepository.find({
			relations: ['user'],
			where: { id: +contractId },
		})
		res.status(HttpStatusCodes.OK).json(contracts)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export async function editContractsById(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	const persists = await contractRepository.findOne({
		where: { id: +req.params.contractId },
	})
	if (!persists) {
		res
			.status(HttpStatusCodes.NOT_FOUND)
			.json({ error: CONTRACT_NOT_FOUND_ERR })
		return
	}

	try {
		Object.assign(persists, req.body)

		const updatedContract = await contractRepository.save(persists)
		res.status(HttpStatusCodes.OK).json(updatedContract)
	} catch (err) {
		console.error(err)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: CONTRACT_UPDATE_FAILED_ERR })
	}
}

export const deleteContractsById = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		const contractId = req.params.id

		const contract = await contractRepository.findOne({
			where: { id: +contractId },
		})
		if (!contract) {
			throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR)
		}
		const deletedContract = await contractRepository.remove(contract)

		res.status(HttpStatusCodes.OK).json(deletedContract)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

// **** Export default **** //
export default {
	getContracts,
	createContract,
	getContractsById,
	deleteContractsById,
} as const
