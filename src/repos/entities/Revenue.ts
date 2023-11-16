import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Revenue {
	@PrimaryGeneratedColumn()
	public id!: number

	@Column({ type: 'real' })
	public weeklyAverage!: string

	@Column({ type: 'real' })
	public dailyAverage!: string

	@Column({ type: 'date' })
	public date!: Date

	@CreateDateColumn({ type: 'date' })
	public createdAt!: Date
}
