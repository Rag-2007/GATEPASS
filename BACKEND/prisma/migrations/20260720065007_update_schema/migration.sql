/*
  Warnings:

  - The values [DayPass,HomePass] on the enum `PassType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PassType_new" AS ENUM ('DAY_PASS', 'HOME_PASS');
ALTER TABLE "Pass" ALTER COLUMN "passType" TYPE "PassType_new" USING ("passType"::text::"PassType_new");
ALTER TYPE "PassType" RENAME TO "PassType_old";
ALTER TYPE "PassType_new" RENAME TO "PassType";
DROP TYPE "public"."PassType_old";
COMMIT;
