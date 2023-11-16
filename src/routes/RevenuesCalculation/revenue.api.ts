
import { Router } from 'express'
import {
	RevenuePart,
	RevenuePartForLast6Month,
} from './revenue.api.handler'

const router = Router()

// TODO: should be added the is Admin middlewhere or add the logic to check that in the same auth middlewhere
router.get('/crone', RevenuePart)
router.get('/pastRevenues', RevenuePartForLast6Month)

export default router
