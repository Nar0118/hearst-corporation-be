import { MigrationInterface, QueryRunner } from 'typeorm'

export class changeContractFieldsToReal1682188004889
	implements MigrationInterface
{
	name = 'changeContractFieldsToReal1682188004889'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "hostingCost"`)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "hostingCost" real NOT NULL DEFAULT '0'`,
		)
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "machineWatt"`)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "machineWatt" real NOT NULL DEFAULT '0'`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" DROP COLUMN "electricityCost"`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "electricityCost" real NOT NULL DEFAULT '0'`,
		)
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "minersCost"`)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "minersCost" real NOT NULL DEFAULT '0'`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "minersCost"`)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "minersCost" integer NOT NULL`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" DROP COLUMN "electricityCost"`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "electricityCost" integer NOT NULL`,
		)
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "machineWatt"`)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "machineWatt" integer NOT NULL`,
		)
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "hostingCost"`)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "hostingCost" integer NOT NULL`,
		)
	}
}
