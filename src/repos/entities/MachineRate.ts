import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Machine } from "./Machine";

@Entity()
export class MachineRate {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column()
  public accepted!: string;

  @Column()
  public stale!: number;

  @Column()
  public other!: string;

  @Column()
  public createAt!: string;

  @ManyToOne(() => Machine, (machine) => machine.machineRate)
  public machine!: Machine;
}
