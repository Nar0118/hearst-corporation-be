import { MigrationInterface, QueryRunner } from 'typeorm'

export class addedContractStartingDate1682076477082
	implements MigrationInterface
{
	name = 'addedContractStartingDate1682076477082'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "contract" DROP COLUMN "customerEmail"`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "contractStartingDate" date NOT NULL DEFAULT now()`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "timeToPlug" date NOT NULL DEFAULT now()`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "plugDate" date NOT NULL DEFAULT now()`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "plugDate"`)
		await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "timeToPlug"`)
		await queryRunner.query(
			`ALTER TABLE "contract" DROP COLUMN "contractStartingDate"`,
		)
		await queryRunner.query(
			`ALTER TABLE "contract" ADD "customerEmail" character varying NOT NULL`,
		)
	}
}
