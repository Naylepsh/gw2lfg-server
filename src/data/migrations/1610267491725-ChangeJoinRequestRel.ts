import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeJoinRequestRel1610267491725 implements MigrationInterface {
    name = 'ChangeJoinRequestRel1610267491725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_04fd9561fde2db761df5777092c"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_ce6aa345f12b77df95cd4ddb060"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_aae872a03b4e14d902d4fb70608"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "REL_04fd9561fde2db761df5777092"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "REL_ce6aa345f12b77df95cd4ddb06"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "REL_aae872a03b4e14d902d4fb7060"`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_04fd9561fde2db761df5777092c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_ce6aa345f12b77df95cd4ddb060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_aae872a03b4e14d902d4fb70608" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_aae872a03b4e14d902d4fb70608"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_ce6aa345f12b77df95cd4ddb060"`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "FK_04fd9561fde2db761df5777092c"`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "REL_aae872a03b4e14d902d4fb7060" UNIQUE ("roleId")`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "REL_ce6aa345f12b77df95cd4ddb06" UNIQUE ("postId")`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "REL_04fd9561fde2db761df5777092" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_aae872a03b4e14d902d4fb70608" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_ce6aa345f12b77df95cd4ddb060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "FK_04fd9561fde2db761df5777092c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
