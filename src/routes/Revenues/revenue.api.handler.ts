import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { RouteError } from '@src/other/classes'
import { revenueRepository, userRepository } from '@src/index'
import { Response } from 'express'
import logger from 'jet-logger'
import axios from 'axios'
import {
	Errors,
	SOMETHING_WENT_WRONG_ERR,
} from '../AuthRouts/auth.api.handlers'
import { AuthenticatedRequest } from '@src/middleware/AuthMiddleware'
import { Roles } from '@src/repos/entities/User'
import { Revenue } from '@src/repos/entities/Revenue'
import {
	getTotalPages,
	PaginationRequest,
} from '@src/middleware/PaginationMiddleware'
import { DEFAULT_PAGE_SIZE } from '@src/constants/constants'

const REVENUE_CREATE_FAILED_ERR = 'Revenue creation failed!'
const REVENUE_NOT_FOUND_ERR = 'Revenue not found!'
const REVENUE_UPDATE_FAILED_ERR = 'Revenue update failed!'

export const createRevenue = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	const user = await userRepository.findOne({ where: { id: userId } })

	// TODO: move this in some guard, instead of writing everywhere
	if (!user || user?.role !== Roles.Admin) {
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
		return
	}

	try {
		const revenue = new Revenue()
		Object.assign(revenue, req.body)
		const persists = await revenueRepository.save(revenue)
		res.status(HttpStatusCodes.CREATED).json(persists)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: REVENUE_CREATE_FAILED_ERR })
	}
}

// TODO: Need to have Admin Guard on this API
export const getRevenues = async (req: PaginationRequest, res: Response) => {
	try {
		const take = Number(req?.query?.limit) || DEFAULT_PAGE_SIZE;
		const [revenues, count] = await revenueRepository.findAndCount({
			skip: req.skip,
			take
		})

		const totalPages = getTotalPages(count, take)

		res.status(HttpStatusCodes.OK).json({
			revenues,
			totalPages,
			currentPage: req.pageNumber,
		})
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export const getRevenueById = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		const revenueId = req.params.id
		const revenues = await revenueRepository.find({
			where: { id: +revenueId },
		})
		res.status(HttpStatusCodes.OK).json(revenues)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			// TODO: Need to create Error codes system
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

export async function editRevenueById(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	const persists = await revenueRepository.findOne({
		where: { id: +req.params.id },
	})
	if (!persists) {
		res.status(HttpStatusCodes.NOT_FOUND).json({ error: REVENUE_NOT_FOUND_ERR })
		return
	}

	try {
		Object.assign(persists, req.body)

		const updatedRevenue = await revenueRepository.save(persists)
		res.status(HttpStatusCodes.OK).json(updatedRevenue)
	} catch (err) {
		console.error(err)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: REVENUE_UPDATE_FAILED_ERR })
	}
}

export const deleteRevenueById = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id
	if (!userId) {
		res.status(HttpStatusCodes.UNAUTHORIZED).json({ error: Errors.Unauth })
		return
	}

	try {
		const revenueId = req.params.id

		const revenue = await revenueRepository.findOne({
			where: { id: +revenueId },
		})
		if (!revenue) {
			throw new RouteError(HttpStatusCodes.NOT_FOUND, REVENUE_NOT_FOUND_ERR)
		}
		const deletedRevenue = await revenueRepository.remove(revenue)

		res.status(HttpStatusCodes.OK).json(deletedRevenue)
	} catch (error) {
		logger.err(error)
		res
			.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
			.json({ error: SOMETHING_WENT_WRONG_ERR })
	}
}

// **** Export default **** //
export default {
	getRevenues,
	createRevenue,
	getRevenueById,
	deleteRevenueById,
} as const
