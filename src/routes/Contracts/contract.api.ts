import { WithAuth } from '@src/middleware/AuthMiddleware'
import { isAdmin } from '@src/middleware/IsAdminMiddleware'
import { WithPagination } from '@src/middleware/PaginationMiddleware'
import validator, { RequestPart } from '@src/middleware/validator'
import { Router } from 'express'
import {
	createContract,
	getContracts,
	getContractsById,
	deleteContractsById,
	editContractsById,
} from './contract.api.handler'
import contractSchema from './contract.schema'

const router = Router()

// TODO: should be added the is Admin middlewhere or add the logic to check that in the same auth middlewhere
router.get('/', WithAuth, isAdmin, WithPagination, getContracts)
router.get('/:id', WithAuth, isAdmin, getContractsById)
router.put(
	'/:contractId',
	WithAuth,
	isAdmin,
	validator(contractSchema.updateSchema, RequestPart.BODY),
	editContractsById,
)
router.delete('/:id', WithAuth, isAdmin, deleteContractsById)
router.post(
	'/',
	WithAuth,
	isAdmin,
	validator(contractSchema.createSchema, RequestPart.BODY),
	createContract,
)

export default router
