import { WithAuth } from '@src/middleware/AuthMiddleware'
import { isAdmin } from '@src/middleware/IsAdminMiddleware'
import { WithPagination } from '@src/middleware/PaginationMiddleware'
import validator, { RequestPart } from '@src/middleware/validator'
import { Router } from 'express'
import {
	getMachines,
	deleteMachineById,
	createMachine,
	editMachineById,
} from './machine.api.handler'
import machineSchema from './machine.schema'

const router = Router()

router.get(
	'/:contractId',
	WithAuth,
	isAdmin,
	WithPagination,
	validator(machineSchema.getByContractIdSchema, RequestPart.PARAMS),
	getMachines,
)
router.put(
	'/:machineId',
	WithAuth,
	isAdmin,
	validator(machineSchema.updateMachine, RequestPart.BODY),
	editMachineById,
)
router.delete('/:machineId', WithAuth, deleteMachineById)
router.post(
	'/',
	WithAuth,
	isAdmin,
	validator(machineSchema.createSchema, RequestPart.BODY),
	createMachine,
)

export default router
