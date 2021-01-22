import {MigrationInterface, QueryRunner} from "typeorm";

export class addCreatedUpdatedFieldsToRaidBoss1611312282840 implements MigrationInterface {
    name = 'addCreatedUpdatedFieldsToRaidBoss1611312282840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raid_boss" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "raid_boss" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raid_boss" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "raid_boss" DROP COLUMN "createdAt"`);
    }

}
