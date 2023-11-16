import EnvVars from '@src/constants/EnvVars'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface TokenPayload {
	id: number
	username: string
	role: string
	ownerId: number
	// add any other properties to the token payload as needed
}

export interface AuthenticatedRequest extends Request {
	user?: TokenPayload
}

export const WithAuth = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization
	if (!authHeader) {
		return res.status(401).json({ message: 'Authorization header not found' })
	}

	const token = authHeader.split(' ')[1]
	if (!token) {
		return res
			.status(401)
			.json({ message: 'Token not found in Authorization header' })
	}

	try {
		const decodedToken = jwt.verify(token, EnvVars.Jwt.Secret) as TokenPayload
		req.user = decodedToken
		next()
	} catch (err) {
		return res.status(401).json({ message: 'Invalid or expired token' })
	}
}
