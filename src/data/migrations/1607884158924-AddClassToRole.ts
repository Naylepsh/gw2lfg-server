import {MigrationInterface, QueryRunner} from "typeorm";

export class AddClassToRole1607884158924 implements MigrationInterface {
    name = 'AddClassToRole1607884158924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "class" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "class"`);
    }

}
