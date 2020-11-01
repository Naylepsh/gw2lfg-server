import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPostingAndBossEntities1603738183083 implements MigrationInterface {
    name = 'AddPostingAndBossEntities1603738183083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requirement" DROP CONSTRAINT "FK_815c74077d75c79fb34d51d403e"`);
        await queryRunner.query(`CREATE TABLE "raid_posting" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "server" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_94ac8606754b74fea61fc730dd3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "raid_boss" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "cm" boolean NOT NULL, CONSTRAINT "PK_cddc048f22389da69ab871e1f05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "requirement" DROP COLUMN "postingId"`);
        await queryRunner.query(`ALTER TABLE "raid_posting" ADD CONSTRAINT "FK_b59708016ea61fc820ac2386b89" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raid_posting" DROP CONSTRAINT "FK_b59708016ea61fc820ac2386b89"`);
        await queryRunner.query(`ALTER TABLE "requirement" ADD "postingId" integer`);
        await queryRunner.query(`DROP TABLE "raid_boss"`);
        await queryRunner.query(`DROP TABLE "raid_posting"`);
        await queryRunner.query(`ALTER TABLE "requirement" ADD CONSTRAINT "FK_815c74077d75c79fb34d51d403e" FOREIGN KEY ("postingId") REFERENCES "posting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
