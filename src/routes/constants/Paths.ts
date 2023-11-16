/**
 * Express router paths go here.
 */

import { Immutable } from '@src/other/types'

const Paths = {
	Base: '/api',
	Users: {
		Base: '/users',
	},
	Auth: {
		Base: '/auth',
	},
	Dashboard: {
		Base: '/dashboard',
	},
	Contract: {
		Base: '/contract',
	},
	Revenue: {
		Base: '/revenue',
	},
	Machines: {
		Base: '/machines',
	},
	SubAccount: {
		Base: '/subaccount',
	},
	RevenueCalculation: {
		Base: '/revenue-calculation',
	},
}

export type TPaths = Immutable<typeof Paths>
export default Paths as TPaths
