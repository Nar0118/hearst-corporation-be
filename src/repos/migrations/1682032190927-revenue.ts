import { MigrationInterface, QueryRunner } from 'typeorm'

export class revenue1682032190927 implements MigrationInterface {
	name = 'revenue1682032190927'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "revenue" ("id" SERIAL NOT NULL, "weeklyAverage" real NOT NULL, "dailyAverage" real NOT NULL, "date" date NOT NULL, "createdAt" date NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_843523949384ce16042013dacc7" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`ALTER TABLE "revenue" ADD CONSTRAINT "FK_34de35e03813be5fd575b32099a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "revenue" DROP CONSTRAINT "FK_34de35e03813be5fd575b32099a"`,
		)
		await queryRunner.query(`DROP TABLE "revenue"`)
	}
}
