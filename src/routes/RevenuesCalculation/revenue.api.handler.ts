import HttpStatusCodes from '@src/constants/HttpStatusCodes'
import { revenueRepository } from '@src/index'
import { Response } from 'express'
import logger from 'jet-logger'
import axios from 'axios'



export const RevenuePart = async (
	req: any,
	res: Response,
) => {
	try {
		const hashratArray: any[] = []
		const revenueArray: any[] = []
		const daily: number[] = []
		let weekSum = 0;
		let dailyValue = {
			date: '',
			value: 0
		};
		try {
			const responseRev = await axios.get('https://api.blockchain.info/charts/miners-revenue?timespan=8days&sampled=true&metadata=false&daysAverageString=7d&cors=true&format=json');
			const responseHash = await axios.get('https://api.blockchain.info/charts/hash-rate?timespan=8days&sampled=true&metadata=false&daysAverageString=7d&cors=true&format=json');

			revenueArray.push(...responseRev.data.values);
			hashratArray.push(...responseHash.data.values)

		} catch (error) {
			console.error(error);
		}
		if (hashratArray.length === revenueArray.length) {
			for (let i = 0; i < hashratArray.length; i++) {
				const value1 = hashratArray[i].y;
				const value2 = revenueArray[i].y;
				const result = value2 / value1;
				weekSum += result;
				dailyValue = {
					date: hashratArray[i].x,
					value: result
				};
				daily.push(result);
			}
		}
		const data = {
			dailyAverage: dailyValue.value.toString(),
			date: new Date(Number(dailyValue.date) * 1000),
			weeklyAverage: (weekSum / 7).toString(),
		}
		const persists = await revenueRepository.save(data)
		res.status(HttpStatusCodes.OK).json({})
	} catch (err) {
		logger.err(err)
	}
}

export const RevenuePartForLast6Month = async (
	req: any,
	res: Response,
) => {
	try {
		await revenueRepository.clear()
		const hashratArray: any[] = []
		const revenueArray: any[] = []
		const daily: number[] = []
		const resultArr: any[] = []

		let weekSum = 0;
		let dailyValue = {
			date: '',
			value: 0,
			weeklyAverage: 0
		};
		const days = Math.ceil((new Date().getTime() - new Date('02-01-2023').getTime())/1000/60/60/24);
		try {
			const responseRev = await axios.get(`https://api.blockchain.info/charts/miners-revenue?timespan=${days}days&sampled=true&metadata=false&daysAverageString=1d&cors=true&format=json`);
			const responseHash = await axios.get(`https://api.blockchain.info/charts/hash-rate?timespan=${days}days&sampled=true&metadata=false&daysAverageString=1d&cors=true&format=json`);
			
			revenueArray.push(...responseRev.data.values);
			hashratArray.push(...responseHash.data.values)

		} catch (error) {
			console.error(error);
		}
		if (hashratArray.length === revenueArray.length) {
			for (let i = 0; i < hashratArray.length; i++) {
				const value1 = hashratArray[i].y;
				const value2 = revenueArray[i].y;

				const result = value2 / value1;

				weekSum = 0;
				for (let j = i >= 6 ? i - 6 : 0; j <= i; j++) {
					const value1 = hashratArray[j].y;
					const value2 = revenueArray[j].y;
					const result = value2 / value1;

					weekSum += result;
				}
				weekSum = i >= 6 ? weekSum / 7 : weekSum / (i + 1);
				dailyValue = {
					date: hashratArray[i].x,
					value: result,
					weeklyAverage: weekSum,
				};
				resultArr.push(dailyValue);
				daily.push(result);
			}
		}
		for (let i = 0; i < resultArr.length; i++) {
			const element = resultArr[i];
			const data = {
				dailyAverage: element.value.toString(),
				date: new Date(Number(element.date) * 1000),
				weeklyAverage: element.weeklyAverage.toString(),
			}
			const persists = await revenueRepository.save(data)
		}
		res.status(HttpStatusCodes.OK).json([])
	} catch (err) {
		logger.err(err)
	}
}

// **** Export default **** //
export default {
	RevenuePart,
	RevenuePartForLast6Month
} as const
