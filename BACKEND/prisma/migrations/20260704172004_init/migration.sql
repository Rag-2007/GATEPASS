/*
  Warnings:

  - The values [Pending,ParentApproved,CaretakerApproved,Active,Completed,Rejected,Cancelled] on the enum `PassStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `PassAction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Action_id` on the `PassAction` table. All the data in the column will be lost.
  - You are about to drop the column `User_id` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[User_Id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - The required column `Action_Id` was added to the `PassAction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `User_Id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PassStatus_new" AS ENUM ('PENDING', 'CANCELLED', 'Parentapproved', 'CareTakerapproved', 'CHECKEDIN', 'CHECKEDOUT');
ALTER TABLE "public"."Pass" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "Pass" ALTER COLUMN "Status" TYPE "PassStatus_new" USING ("Status"::text::"PassStatus_new");
ALTER TYPE "PassStatus" RENAME TO "PassStatus_old";
ALTER TYPE "PassStatus_new" RENAME TO "PassStatus";
DROP TYPE "public"."PassStatus_old";
ALTER TABLE "Pass" ALTER COLUMN "Status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "Blocked" DROP CONSTRAINT "Blocked_Blocked_Role_ID_fkey";

-- DropForeignKey
ALTER TABLE "Hostel" DROP CONSTRAINT "Hostel_CareTaker_Id_fkey";

-- DropForeignKey
ALTER TABLE "Hostel" DROP CONSTRAINT "Hostel_Warden_Id_fkey";

-- DropForeignKey
ALTER TABLE "PassAction" DROP CONSTRAINT "PassAction_Actor_Id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_User_id_fkey";

-- DropIndex
DROP INDEX "Student_User_id_key";

-- AlterTable
ALTER TABLE "Blocked" ALTER COLUMN "Blocked_Role_ID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pass" ALTER COLUMN "Status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "PassAction" DROP CONSTRAINT "PassAction_pkey",
DROP COLUMN "Action_id",
ADD COLUMN     "Action_Id" TEXT NOT NULL,
ADD CONSTRAINT "PassAction_pkey" PRIMARY KEY ("Action_Id");

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "User_id",
ADD COLUMN     "User_Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "Id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("Id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_User_Id_key" ON "Student"("User_Id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_User_Id_fkey" FOREIGN KEY ("User_Id") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_CareTaker_Id_fkey" FOREIGN KEY ("CareTaker_Id") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_Warden_Id_fkey" FOREIGN KEY ("Warden_Id") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassAction" ADD CONSTRAINT "PassAction_Actor_Id_fkey" FOREIGN KEY ("Actor_Id") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_Blocked_Role_ID_fkey" FOREIGN KEY ("Blocked_Role_ID") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
