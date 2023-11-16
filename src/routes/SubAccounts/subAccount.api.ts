import { WithAuth } from '@src/middleware/AuthMiddleware'
import { isAdmin } from '@src/middleware/IsAdminMiddleware'
import { WithPagination } from '@src/middleware/PaginationMiddleware'
import { Router } from 'express'
import { getUserSubAccounts } from './subAccount.api.handler'
import { isUser } from '@src/middleware/IsUserMiddleware'


const router = Router()

// TODO: should be added the is Admin middlewhere or add the logic to check that in the same auth middlewhere
router.get(
	'/',
	WithAuth,
	isUser,
	WithPagination,
	getUserSubAccounts
)

export default router
