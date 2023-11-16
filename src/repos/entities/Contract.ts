import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Machine } from './Machine'
import { User } from './User'

@Entity()
export class Contract {

	@PrimaryGeneratedColumn()
	public id!: number

	@Column()
	public subAccountUserId!: string

	@CreateDateColumn({ type: 'date' })
	public contractStartingDate!: Date

	@CreateDateColumn({ type: 'date' })
	public timeToPlug!: Date

	@CreateDateColumn({ type: 'date' })
	public plugDate!: Date

	@Column({ type: 'real', default: '0' })
	public hostingCost!: string

	@Column()
	public subAccountApiKey!: string

	@Column()
	public subAccountApiSecret!: string

	@Column()
	public machineType!: string

	@Column()
	public contractStatus!: string

	@Column()
	public numberOfMachines!: number

	@Column({ type: 'real', default: '0' })
	public machineWatt!: string

	@Column()
	public machineTH!: number

	@Column({ type: 'real', default: '0' })
	public electricityCost!: string

	@Column({ type: 'real', default: '0' })
	public minersCost!: string

	@Column()
	public location!: string

	@Column()
	public hostingCompany!: string

	@Column()
	public machineSupplier!: string

	@Column()
	public totalInvestment!: string

	@Column()
	public hearstUpfront!: string

	@Column()
	public yearToCapitalConstitution!: string

	@Column({ type: 'real' })
	public hashRate!: string

	@Column({ type: 'real' })
	public hashRatePercent!: string

	@Column({ type: 'real' })
	public lastMonthMined!: string

	@Column({ type: 'real' })
	public lastMonthRevenue!: string

	@Column({ type: 'real' })
	public lastMonthApy!: string

	@Column({ type: 'real' })
	public lastMonthMinedPercent!: string

	@Column({ type: 'real' })
	public lastMonthRevenuePercent!: string

	@Column({ type: 'real' })
	public lastMonthApyPercent!: string

	@CreateDateColumn({ type: 'date' })
	public createdAt!: Date

	@Column()
	public monthlyElectricityCost!: string

	@ManyToOne(() => User, (user) => user.contracts)
	public user!: User

	@OneToMany(() => Machine, (machine) => machine.contract)
	public machines!: Machine[]
}
