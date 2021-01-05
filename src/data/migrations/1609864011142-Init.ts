import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1609864011142 implements MigrationInterface {
    name = 'Init1609864011142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "class" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "apiKey" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL, "server" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b499447822de3f24ad355e19b8" ON "post" ("type") `);
        await queryRunner.query(`CREATE TABLE "requirement" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "quantity" integer, "type" character varying NOT NULL, "postId" integer, CONSTRAINT "PK_5e3278ee8e2094dd0f10a4aec62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_100bb9f7884a7eecf246f41304" ON "requirement" ("type") `);
        await queryRunner.query(`CREATE TABLE "join_request" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "postId" integer, "roleId" integer, CONSTRAINT "REL_04fd9561fde2db761df5777092" UNIQUE ("userId"), CONSTRAINT "REL_ce6aa345f12b77df95cd4ddb06" UNIQUE ("postId"), CONSTRAINT "REL_aae872a03b4e14d902d4fb7060" UNIQUE ("roleId"), CONSTRAINT "PK_ea4ce3bfd1dcd38029f3176bb4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "raid_boss" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isCm" boolean NOT NULL, CONSTRAINT "PK_cddc048f22389da69ab871e1f05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_bosses_raid_boss" ("postId" integer NOT NULL, "raidBossId" integer NOT NULL, CONSTRAINT "PK_8bb5f00089213122b4ef3a6cc99" PRIMARY KEY ("postId", "raidBossId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9ba69208e199e090cd5b96e981" ON "post_bosses_raid_boss" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3b319da7828c3ebc4849aa29b0" ON "post_bosses_raid_boss" ("raidBossId") `);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_5f7023785137d6d25f46dab0322" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "requirement" ADD CONSTRAINT "FK_cecce07ec08513e22aee317d213" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_04fd9561fde2db761df5777092c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_ce6aa345f12b77df95cd4ddb060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_aae872a03b4e14d902d4fb70608" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_bosses_raid_boss" ADD CONSTRAINT "FK_9ba69208e199e090cd5b96e9810" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_bosses_raid_boss" ADD CONSTRAINT "FK_3b319da7828c3ebc4849aa29b0f" FOREIGN KEY ("raidBossId") REFERENCES "raid_boss"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_bosses_raid_boss" DROP CONSTRAINT "FK_3b319da7828c3ebc4849aa29b0f"`);
        await queryRunner.query(`ALTER TABLE "post_bosses_raid_boss" DROP CONSTRAINT "FK_9ba69208e199e090cd5b96e9810"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_aae872a03b4e14d902d4fb70608"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_ce6aa345f12b77df95cd4ddb060"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_04fd9561fde2db761df5777092c"`);
        await queryRunner.query(`ALTER TABLE "requirement" DROP CONSTRAINT "FK_cecce07ec08513e22aee317d213"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_5f7023785137d6d25f46dab0322"`);
        await queryRunner.query(`DROP INDEX "IDX_3b319da7828c3ebc4849aa29b0"`);
        await queryRunner.query(`DROP INDEX "IDX_9ba69208e199e090cd5b96e981"`);
        await queryRunner.query(`DROP TABLE "post_bosses_raid_boss"`);
        await queryRunner.query(`DROP TABLE "raid_boss"`);
        await queryRunner.query(`DROP TABLE "join_request"`);
        await queryRunner.query(`DROP INDEX "IDX_100bb9f7884a7eecf246f41304"`);
        await queryRunner.query(`DROP TABLE "requirement"`);
        await queryRunner.query(`DROP INDEX "IDX_b499447822de3f24ad355e19b8"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
