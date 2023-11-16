import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Contract } from './Contract'

export enum Roles {
	Admin = 'Admin',
	Customer = 'Customer',
	SubAccount = 'SubAccount'
}

export interface IUser {
	id: number
	email: string
	companyName: string | undefined
	role: string
	username: string | undefined
	password: string
	contracts: Contract[]
}

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	public id!: number

	@Column()
	public email!: string

	@Column({
		type: 'varchar',
	})
	public companyName!: string

	@Column({
		type: 'enum',
		enum: Roles,
		default: Roles.Customer,
	})
	public role!: string

	@Column({
		type: 'varchar',
		nullable: true,
	})
	public username!: string

	@Column()
	public password!: string

	@Column()
	public picture!: string

	@Column()
	public firstName!: string

	@Column()
	public lastName!: string

	@Column()
	public ownerId!: number

	@OneToMany(() => Contract, (contract) => contract.user)
	public contracts!: Contract[]
}
