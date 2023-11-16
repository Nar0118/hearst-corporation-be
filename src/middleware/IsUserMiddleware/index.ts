import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { Roles } from '@src/repos/entities/User'
import { SOMETHING_WENT_WRONG_ERR } from '@src/routes/AuthRouts/auth.api.handlers'
import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../AuthMiddleware'

const FORBIDDEN_ERR = 'This request only for users!'

export const isUser = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = req.user
		if (!user || (user?.role !== Roles.Customer && user?.role !== Roles.SubAccount)) {
			return res
				.status(HttpStatusCodes.FORBIDDEN)
				.json({ message: FORBIDDEN_ERR })
		}
		next()
	} catch (err) {
		return res
			.status(HttpStatusCodes.FORBIDDEN)
			.json({ message: SOMETHING_WENT_WRONG_ERR })
	}
}
