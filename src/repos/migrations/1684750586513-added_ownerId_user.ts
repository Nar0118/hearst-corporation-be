import { MigrationInterface, QueryRunner } from "typeorm";

export class addedOwnerIdUser1684750586513 implements MigrationInterface {
    name = 'addedOwnerIdUser1684750586513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "ownerId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "monthlyElectricityCost" DROP NOT NULL`);
    }

}
