import {MigrationInterface, QueryRunner} from "typeorm";

export class init1607095266287 implements MigrationInterface {
    name = 'init1607095266287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "join_request" ("userId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f6b7f58b1ae56accb7a6fc14c31" PRIMARY KEY ("userId", "postId"))`);
        await queryRunner.query(`CREATE TABLE "requirement" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quantity" integer, "type" character varying NOT NULL, CONSTRAINT "PK_5e3278ee8e2094dd0f10a4aec62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_100bb9f7884a7eecf246f41304" ON "requirement" ("type") `);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "apiKey" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "server" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "raid_boss" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isCm" boolean NOT NULL, CONSTRAINT "PK_cddc048f22389da69ab871e1f05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "raid_post" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "server" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorId" integer, CONSTRAINT "PK_408e64f0492dc751caab84c6cf5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_requirements_requirement" ("postId" integer NOT NULL, "requirementId" integer NOT NULL, CONSTRAINT "PK_b2fd3429ce2ada996673cdcd15e" PRIMARY KEY ("postId", "requirementId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_676c4b1197dcb516a80fc7364e" ON "post_requirements_requirement" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_90461d07b7741d3f407c29009c" ON "post_requirements_requirement" ("requirementId") `);
        await queryRunner.query(`CREATE TABLE "raid_post_requirements_requirement" ("raidPostId" integer NOT NULL, "requirementId" integer NOT NULL, CONSTRAINT "PK_8248072a5032099dab5b7158a3b" PRIMARY KEY ("raidPostId", "requirementId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_33d5474db21be0554f13d4a88c" ON "raid_post_requirements_requirement" ("raidPostId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d1129bef3663de6c7b3cb7dfb" ON "raid_post_requirements_requirement" ("requirementId") `);
        await queryRunner.query(`CREATE TABLE "raid_post_bosses_raid_boss" ("raidPostId" integer NOT NULL, "raidBossId" integer NOT NULL, CONSTRAINT "PK_bb6aaa2def685f85abbb42096d9" PRIMARY KEY ("raidPostId", "raidBossId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ce0b4c6a0c0494a5640994006c" ON "raid_post_bosses_raid_boss" ("raidPostId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c9b29ebde509e4d56c5f2d5cdf" ON "raid_post_bosses_raid_boss" ("raidBossId") `);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_5f7023785137d6d25f46dab0322" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "raid_post" ADD CONSTRAINT "FK_2b918f62eb6ea922189c4d67858" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_requirements_requirement" ADD CONSTRAINT "FK_676c4b1197dcb516a80fc7364e8" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_requirements_requirement" ADD CONSTRAINT "FK_90461d07b7741d3f407c29009cb" FOREIGN KEY ("requirementId") REFERENCES "requirement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "raid_post_requirements_requirement" ADD CONSTRAINT "FK_33d5474db21be0554f13d4a88c6" FOREIGN KEY ("raidPostId") REFERENCES "raid_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "raid_post_requirements_requirement" ADD CONSTRAINT "FK_0d1129bef3663de6c7b3cb7dfb4" FOREIGN KEY ("requirementId") REFERENCES "requirement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "raid_post_bosses_raid_boss" ADD CONSTRAINT "FK_ce0b4c6a0c0494a5640994006c2" FOREIGN KEY ("raidPostId") REFERENCES "raid_post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "raid_post_bosses_raid_boss" ADD CONSTRAINT "FK_c9b29ebde509e4d56c5f2d5cdf5" FOREIGN KEY ("raidBossId") REFERENCES "raid_boss"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raid_post_bosses_raid_boss" DROP CONSTRAINT "FK_c9b29ebde509e4d56c5f2d5cdf5"`);
        await queryRunner.query(`ALTER TABLE "raid_post_bosses_raid_boss" DROP CONSTRAINT "FK_ce0b4c6a0c0494a5640994006c2"`);
        await queryRunner.query(`ALTER TABLE "raid_post_requirements_requirement" DROP CONSTRAINT "FK_0d1129bef3663de6c7b3cb7dfb4"`);
        await queryRunner.query(`ALTER TABLE "raid_post_requirements_requirement" DROP CONSTRAINT "FK_33d5474db21be0554f13d4a88c6"`);
        await queryRunner.query(`ALTER TABLE "post_requirements_requirement" DROP CONSTRAINT "FK_90461d07b7741d3f407c29009cb"`);
        await queryRunner.query(`ALTER TABLE "post_requirements_requirement" DROP CONSTRAINT "FK_676c4b1197dcb516a80fc7364e8"`);
        await queryRunner.query(`ALTER TABLE "raid_post" DROP CONSTRAINT "FK_2b918f62eb6ea922189c4d67858"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_5f7023785137d6d25f46dab0322"`);
        await queryRunner.query(`DROP INDEX "IDX_c9b29ebde509e4d56c5f2d5cdf"`);
        await queryRunner.query(`DROP INDEX "IDX_ce0b4c6a0c0494a5640994006c"`);
        await queryRunner.query(`DROP TABLE "raid_post_bosses_raid_boss"`);
        await queryRunner.query(`DROP INDEX "IDX_0d1129bef3663de6c7b3cb7dfb"`);
        await queryRunner.query(`DROP INDEX "IDX_33d5474db21be0554f13d4a88c"`);
        await queryRunner.query(`DROP TABLE "raid_post_requirements_requirement"`);
        await queryRunner.query(`DROP INDEX "IDX_90461d07b7741d3f407c29009c"`);
        await queryRunner.query(`DROP INDEX "IDX_676c4b1197dcb516a80fc7364e"`);
        await queryRunner.query(`DROP TABLE "post_requirements_requirement"`);
        await queryRunner.query(`DROP TABLE "raid_post"`);
        await queryRunner.query(`DROP TABLE "raid_boss"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP INDEX "IDX_100bb9f7884a7eecf246f41304"`);
        await queryRunner.query(`DROP TABLE "requirement"`);
        await queryRunner.query(`DROP TABLE "join_request"`);
    }

}
