import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRoleToJoinRequest1607529391496 implements MigrationInterface {
    name = 'AddRoleToJoinRequest1607529391496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_request" ADD "roleId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "PK_f6b7f58b1ae56accb7a6fc14c31"`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "PK_3e804ef24b221bb1d52e6cdd792" PRIMARY KEY ("postId", "userId", "roleId")`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "PK_3e804ef24b221bb1d52e6cdd792"`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "PK_f6b7f58b1ae56accb7a6fc14c31" PRIMARY KEY ("userId", "postId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "PK_f6b7f58b1ae56accb7a6fc14c31"`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "PK_3e804ef24b221bb1d52e6cdd792" PRIMARY KEY ("postId", "userId", "roleId")`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP CONSTRAINT "PK_3e804ef24b221bb1d52e6cdd792"`);
        await queryRunner.query(`ALTER TABLE "join_request" ADD CONSTRAINT "PK_f6b7f58b1ae56accb7a6fc14c31" PRIMARY KEY ("postId", "userId")`);
        await queryRunner.query(`ALTER TABLE "join_request" DROP COLUMN "roleId"`);
    }

}
