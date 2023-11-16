export const calculateSpeed = (speed: number, unit: string) => {
	if (unit === 'PH/s') {
		return speed * Math.pow(10, 15)
	} else if (unit === 'H/s') {
		return speed * Math.pow(10, 12) // TERRA
	}
}

// **** Export default **** //
export default {
	calculateSpeed,
} as const
