/*
  Warnings:

  - The primary key for the `Blocked` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `HostelId` on the `Pass` table. All the data in the column will be lost.
  - You are about to drop the column `Roll_NO` on the `PassAction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[CareTaker_Id]` on the table `Hostel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Warden_Id]` on the table `Hostel` will be added. If there are existing duplicate values, this will fail.
  - Made the column `Blocked_Role_ID` on table `Blocked` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `Remarks` to the `PassAction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Blocked" DROP CONSTRAINT "Blocked_Blocked_Role_ID_fkey";

-- DropForeignKey
ALTER TABLE "Pass" DROP CONSTRAINT "Pass_HostelId_fkey";

-- AlterTable
ALTER TABLE "Blocked" DROP CONSTRAINT "Blocked_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "Blocked_Role_ID" SET NOT NULL,
ADD CONSTRAINT "Blocked_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Blocked_id_seq";

-- AlterTable
ALTER TABLE "Pass" DROP COLUMN "HostelId";

-- AlterTable
ALTER TABLE "PassAction" DROP COLUMN "Roll_NO",
ADD COLUMN     "Remarks" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_CareTaker_Id_key" ON "Hostel"("CareTaker_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Hostel_Warden_Id_key" ON "Hostel"("Warden_Id");

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_Blocked_Role_ID_fkey" FOREIGN KEY ("Blocked_Role_ID") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
