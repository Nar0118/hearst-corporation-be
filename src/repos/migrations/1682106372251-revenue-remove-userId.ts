import { MigrationInterface, QueryRunner } from 'typeorm'

export class revenueRemoveUserId1682106372251 implements MigrationInterface {
	name = 'revenueRemoveUserId1682106372251'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "revenue" DROP CONSTRAINT "FK_34de35e03813be5fd575b32099a"`,
		)
		await queryRunner.query(`ALTER TABLE "revenue" DROP COLUMN "userId"`)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "revenue" ADD "userId" integer`)
		await queryRunner.query(
			`ALTER TABLE "revenue" ADD CONSTRAINT "FK_34de35e03813be5fd575b32099a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
	}
}
