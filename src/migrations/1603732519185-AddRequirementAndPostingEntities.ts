import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRequirementAndPostingEntities1603732519185 implements MigrationInterface {
    name = 'AddRequirementAndPostingEntities1603732519185'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "requirement" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postingId" integer, CONSTRAINT "PK_5e3278ee8e2094dd0f10a4aec62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posting" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "server" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_b535363e80b08416dacf34303a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "requirement" ADD CONSTRAINT "FK_815c74077d75c79fb34d51d403e" FOREIGN KEY ("postingId") REFERENCES "posting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posting" ADD CONSTRAINT "FK_3cdf27a4bd3df2378a8227eb8f6" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posting" DROP CONSTRAINT "FK_3cdf27a4bd3df2378a8227eb8f6"`);
        await queryRunner.query(`ALTER TABLE "requirement" DROP CONSTRAINT "FK_815c74077d75c79fb34d51d403e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "posting"`);
        await queryRunner.query(`DROP TABLE "requirement"`);
    }

}
