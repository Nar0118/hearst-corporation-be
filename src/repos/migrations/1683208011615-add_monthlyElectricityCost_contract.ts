import { MigrationInterface, QueryRunner } from "typeorm";

export class addMonthlyElectricityCostContract1683208011615 implements MigrationInterface {
    name = 'addMonthlyElectricityCostContract1683208011615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ADD "monthlyElectricityCost" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "monthlyElectricityCost"`);
    }
}
