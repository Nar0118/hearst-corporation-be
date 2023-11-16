import { WithAuth } from '@src/middleware/AuthMiddleware'
import { isAdmin } from '@src/middleware/IsAdminMiddleware'
import { WithPagination } from '@src/middleware/PaginationMiddleware'
import validator, { RequestPart } from '@src/middleware/validator'
import { Router } from 'express'
import {
	createRevenue,
	getRevenues,
	getRevenueById,
	deleteRevenueById,
	editRevenueById,
} from './revenue.api.handler'
import revenueSchema from './revenue.schema'

const router = Router()

// TODO: should be added the is Admin middlewhere or add the logic to check that in the same auth middlewhere
router.get('/', WithAuth, isAdmin, WithPagination, getRevenues)
router.get('/:id', WithAuth, isAdmin, getRevenueById)
router.put(
	'/:id',
	WithAuth,
	isAdmin,
	validator(revenueSchema.updateSchema, RequestPart.BODY),
	editRevenueById,
)
router.delete('/:id', WithAuth, isAdmin, deleteRevenueById)
router.post(
	'/',
	WithAuth,
	isAdmin,
	validator(revenueSchema.createSchema, RequestPart.BODY),
	createRevenue,
)

export default router
