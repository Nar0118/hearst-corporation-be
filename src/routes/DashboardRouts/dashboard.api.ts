import { WithAuth } from '@src/middleware/AuthMiddleware'
import { isUser } from '@src/middleware/IsUserMiddleware'
import validator, { RequestPart } from '@src/middleware/validator'
import { Router } from 'express'
import { dashboard, dashboardFirstPart, getAllPaymentHostory, getPaymentHistory } from './dashboard.api.handlers'
import { dashboardSchema, dashboardSchemaForHashrate } from './dashboard.schema'

const router = Router()

router.get(
	'/',
	WithAuth,
	isUser,
	validator(dashboardSchemaForHashrate.filtered, RequestPart.QUERY),
	dashboardFirstPart,
)

router.get(
	'/payment',
	WithAuth,
	isUser,
	validator(dashboardSchema.filtered, RequestPart.QUERY),
	getPaymentHistory,
)

router.get(
	'/first',
	WithAuth,
	isUser,
	validator(dashboardSchema.filtered, RequestPart.QUERY),
	dashboard,
)

router.get(
	'/paymentAll',
	WithAuth,
	isUser,
	getAllPaymentHostory,
)

export default router
