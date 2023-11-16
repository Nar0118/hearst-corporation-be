import { MigrationInterface, QueryRunner } from "typeorm";

export class machineDateFieldContractId1682491198286 implements MigrationInterface {
    name = 'machineDateFieldContractId1682491198286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "date"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "prev1d"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "prev1h"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "prev30m"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "prev10m"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "last1d"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "last1h"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "last30m"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "last10m"`);
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "createAt"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "accepted" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "stale" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "other" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "createAt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "createdAt" date NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "machine" DROP CONSTRAINT "FK_932bdecd63ceb4c134add306821"`);
        await queryRunner.query(`ALTER TABLE "machine" ALTER COLUMN "contractId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine" ADD CONSTRAINT "FK_932bdecd63ceb4c134add306821" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine" DROP CONSTRAINT "FK_932bdecd63ceb4c134add306821"`);
        await queryRunner.query(`ALTER TABLE "machine" ALTER COLUMN "contractId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine" ADD CONSTRAINT "FK_932bdecd63ceb4c134add306821" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "machine" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "createAt"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "other"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "stale"`);
        await queryRunner.query(`ALTER TABLE "machine_rate" DROP COLUMN "accepted"`);
        await queryRunner.query(`ALTER TABLE "machine" ADD "createAt" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "last10m" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "last30m" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "last1h" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "last1d" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "prev10m" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "prev30m" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "prev1h" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "prev1d" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine_rate" ADD "date" date NOT NULL`);
    }

}
