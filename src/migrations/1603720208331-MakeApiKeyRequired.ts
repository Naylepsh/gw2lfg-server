import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeApiKeyRequired1603720208331 implements MigrationInterface {
    name = 'MakeApiKeyRequired1603720208331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "apiKey" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "apiKey"`);
    }

}
