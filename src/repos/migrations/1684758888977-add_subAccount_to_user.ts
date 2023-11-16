import { MigrationInterface, QueryRunner } from "typeorm";

export class addSubAccountToUser1684758888977 implements MigrationInterface {
    name = 'addSubAccountToUser1684758888977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" ADD VALUE 'SubAccount'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'Customer')`);
        }

}
