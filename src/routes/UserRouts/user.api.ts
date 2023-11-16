import { WithAuth } from '@src/middleware/AuthMiddleware'
import { isAdmin } from '@src/middleware/IsAdminMiddleware'
import { WithPagination } from '@src/middleware/PaginationMiddleware'
import validator, { RequestPart } from '@src/middleware/validator'
import { Router } from 'express'
import {
	createUser,
	updateOne,
	_delete as deleteUser,
	getAllUsers,
} from './user.api.handlers'
import userSchema from './user.schema'
import { isUser } from '@src/middleware/IsUserMiddleware'

const router = Router()

router.get('/', WithAuth, isAdmin, WithPagination, getAllUsers)
router.post(
	'/signup',
	validator(userSchema.userAccount, RequestPart.BODY),
	createUser,
)
router.put(
	'/:userId',
	WithAuth,
	isAdmin,
	validator(userSchema.userUpdate, RequestPart.BODY),
	updateOne,
)
router.delete('/:userId', WithAuth, isAdmin, deleteUser)

router.post(
	'/signup/subaccount',
	WithAuth,
	isUser,
	validator(userSchema.userSubAccount, RequestPart.BODY),
	createUser,
)
router.put(
	'/:userId/subaccount',
	WithAuth,
	isUser,
	validator(userSchema.userSubAccountUpdate, RequestPart.BODY),
	updateOne,
)
router.delete('/:userId/subaccount', WithAuth, isUser, deleteUser)

export default router
