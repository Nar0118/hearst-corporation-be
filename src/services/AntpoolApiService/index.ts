import axios, { AxiosInstance } from 'axios'
import crypto from 'crypto'
import { AntpoolEndpoints } from './endpoints'
import { CoinType, Type } from './types'

class AntPoolService {
	private signature: string = ''
	userId: string
	api_key: string
	api_secret: string
	base_url: string
	page: number | undefined
	private nonce = new Date().getTime()
	public API: AxiosInstance

	constructor(
		userId: string,
		apiKey: string,
		apiSecret: string,
		page?: number,
	) {
		this.userId = userId
		this.api_key = apiKey
		this.api_secret = apiSecret
		if (page) {
			this.page = page
		}
		this.base_url = 'https://antpool.com/api'

		this.API = axios.create({
			baseURL: this.base_url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
	}

	private initNonce() {
		this.nonce = new Date().getTime()
	}

	private computeSignature() {
		this.initNonce()
		this.signature = crypto
			.createHmac('sha256', this.api_secret)
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			.update(this.userId + this.api_key + this.nonce)
			.digest('hex')
			.toUpperCase()
	}

	public async getHashRate() {
		this.computeSignature()
		return await this.API.post(AntpoolEndpoints.Workers, {
			key: this.api_key,
			nonce: this.nonce,
			signature: this.signature,
			pageEnable: 0,
		})
	}

	public async getHashrateChartData() {
		this.computeSignature()
		const { data: dailyData } = await this.API.post(
			AntpoolEndpoints.HashRateChart,
			{
				key: this.api_key,
				nonce: this.nonce,
				signature: this.signature,
				type: 3,
				userId: this.userId,
				coinType: CoinType.BTC,
			},
		)

		const { data: hourlyData } = await this.API.post(
			AntpoolEndpoints.HashRateChart,
			{
				key: this.api_key,
				nonce: this.nonce,
				signature: this.signature,
				type: 2,
				userId: this.userId,
				coinType: CoinType.BTC,
			},
		)

		return {
			dailyData: dailyData?.data,
			hourlyData: hourlyData?.data,
		}
	}
	public async getPaymentHistory(page: number, pageSize?: number) {
		this.computeSignature()
		const { data: data } = await this.API.post(
			AntpoolEndpoints.paymentHistoryV2,
			{
				key: this.api_key,
				nonce: this.nonce,
				signature: this.signature,
				type: Type.paymentHistoryV2Type,
				coinType: CoinType.BTC,
				clientUserId: this.userId,
				page: page,
				pageSize
			},
		)

		return data.data
	}

}



export default AntPoolService
