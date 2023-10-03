import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTal1696358442049 implements MigrationInterface {
    name = 'CreateTal1696358442049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('Admin', 'Courier', 'Customer')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'Admin', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_638bac731294171648258260ff2" UNIQUE ("password"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country" ("id" SERIAL NOT NULL, "name_en" character varying(100) NOT NULL, "name_ro" character varying(100) NOT NULL, "name_ru" character varying(100) NOT NULL, CONSTRAINT "UQ_b6e31cc8bb2550bcba2dbfa9a6e" UNIQUE ("name_en"), CONSTRAINT "UQ_b873b0dc59e15922b476525312a" UNIQUE ("name_ro"), CONSTRAINT "UQ_ec311feb9c84329dc4a17b56019" UNIQUE ("name_ru"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "region" ("id" SERIAL NOT NULL, "name_en" character varying(100) NOT NULL, "name_ro" character varying(100) NOT NULL, "name_ru" character varying(100) NOT NULL, CONSTRAINT "UQ_a109f41abdc4356279e1a29fa33" UNIQUE ("name_en"), CONSTRAINT "UQ_fb54df28d72fa981edb7e5a1c09" UNIQUE ("name_ro"), CONSTRAINT "UQ_4544bd27d49cf5f42f2c69c0e85" UNIQUE ("name_ru"), CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "region"`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
