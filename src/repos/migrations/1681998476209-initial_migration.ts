import { MigrationInterface, QueryRunner } from 'typeorm'

export class initialMigration1681998476209 implements MigrationInterface {
	name = 'initialMigration1681998476209'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "machine_rate" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "last10m" character varying NOT NULL, "last30m" character varying NOT NULL, "last1h" character varying NOT NULL, "last1d" character varying NOT NULL, "prev10m" character varying NOT NULL, "prev30m" character varying NOT NULL, "prev1h" character varying NOT NULL, "prev1d" character varying NOT NULL, "date" date NOT NULL, "machineId" integer, CONSTRAINT "PK_f7f8bf7a2d62cc9d17bceeda019" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "machine" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "accepted" character varying NOT NULL, "stale" character varying NOT NULL, "other" character varying NOT NULL, "createAt" character varying NOT NULL, "contractId" integer, CONSTRAINT "PK_acc588900ffa841d96eb5fd566c" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'Customer')`,
		)
		await queryRunner.query(
			`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "companyName" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'Customer', "username" character varying, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "contract" ("id" SERIAL NOT NULL, "subAccountUserId" character varying NOT NULL, "subAccountApiKey" character varying NOT NULL, "subAccountApiSecret" character varying NOT NULL, "machineType" character varying NOT NULL, "numberOfMachines" integer NOT NULL, "machineWatt" integer NOT NULL, "machineTH" integer NOT NULL, "electricityCost" integer NOT NULL, "minersCost" integer NOT NULL, "location" character varying NOT NULL, "hostingCompany" character varying NOT NULL, "machineSupplier" character varying NOT NULL, "totalInvestment" character varying NOT NULL, "hearstUpfront" character varying NOT NULL, "yearToCapitalConstitution" character varying NOT NULL, "hashRate" real NOT NULL, "hashRatePercent" real NOT NULL, "lastMonthMined" real NOT NULL, "lastMonthRevenue" real NOT NULL, "lastMonthApy" real NOT NULL, "lastMonthMinedPercent" real NOT NULL, "lastMonthRevenuePercent" real NOT NULL, "lastMonthApyPercent" real NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "customerEmail" character varying NOT NULL`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "hostingCost" integer NOT NULL`,
		)
		await queryRunner.query(
			`ALTER TABLE "machine_rate" ADD CONSTRAINT "FK_b2230adccb6a48271bf27656174" FOREIGN KEY ("machineId") REFERENCES "machine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "machine" ADD CONSTRAINT "FK_932bdecd63ceb4c134add306821" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD CONSTRAINT "FK_a837a077c734b8f4106c6923685" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "contract" DROP CONSTRAINT "FK_a837a077c734b8f4106c6923685"`,
		)
		await queryRunner.query(
			`ALTER TABLE "machine" DROP CONSTRAINT "FK_932bdecd63ceb4c134add306821"`,
		)
		await queryRunner.query(
			`ALTER TABLE "machine_rate" DROP CONSTRAINT "FK_b2230adccb6a48271bf27656174"`,
		)
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "hostingCost"`)
		await queryRunner.query(
			`ALTER TABLE "contract" DROP COLUMN "customerEmail"`,
		)
		await queryRunner.query(`DROP TABLE "contract"`)
		await queryRunner.query(`DROP TABLE "user"`)
		await queryRunner.query(`DROP TYPE "public"."user_role_enum"`)
		await queryRunner.query(`DROP TABLE "machine"`)
		await queryRunner.query(`DROP TABLE "machine_rate"`)
	}
}
