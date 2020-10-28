import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveQuantityFromPosting1603914265192 implements MigrationInterface {
    name = 'RemoveQuantityFromPosting1603914265192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posting" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "raid_posting" DROP COLUMN "quantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raid_posting" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "posting" ADD "quantity" integer NOT NULL`);
    }

}
