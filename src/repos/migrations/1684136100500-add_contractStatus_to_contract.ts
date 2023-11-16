import { MigrationInterface, QueryRunner } from "typeorm";

export class addContractStatusToContract1684136100500 implements MigrationInterface {
    name = 'addContractStatusToContract1684136100500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "contractStatus" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "monthlyElectricityCost" DROP NOT NULL`);
    }

}
