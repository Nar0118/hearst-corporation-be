import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from './Contract';
import { MachineRate } from './MachineRate';

@Entity()
export class Machine {

	@PrimaryGeneratedColumn()
	public id!: number;

	@Column()
	public name!: string;

	@Column()
	public accepted!: string;

	@Column()
	public stale!: string;

	@Column()
	public other!: string;

	@Column()
	public contractId!: number;

	@CreateDateColumn({ type: 'date' })
	public createdAt!: Date;

	@ManyToOne(() => Contract, (contract) => contract.machines)
	public contract!: Contract;

	@OneToMany(() => MachineRate, (machineRate) => machineRate.machine)
	public machineRate!: MachineRate[];

}
