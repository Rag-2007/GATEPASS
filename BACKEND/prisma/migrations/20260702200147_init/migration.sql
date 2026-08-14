/*
  Warnings:

  - You are about to drop the column `Blocked_Role_id` on the `Blocked` table. All the data in the column will be lost.
  - You are about to drop the column `Actor_id` on the `PassAction` table. All the data in the column will be lost.
  - Added the required column `Blocked_Role_ID` to the `Blocked` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Actor_Id` to the `PassAction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'PARENT', 'CARETAKER', 'WARDEN', 'SECURITY', 'CHIEFWARDEN');

-- AlterTable
ALTER TABLE "Blocked" DROP COLUMN "Blocked_Role_id",
ADD COLUMN     "Blocked_Role_ID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PassAction" DROP COLUMN "Actor_id",
ADD COLUMN     "Actor_Id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT NOT NULL,
    "Role" "Role" NOT NULL,
    "Password_Hash" TEXT NOT NULL,
    "RefreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "Roll_No" TEXT NOT NULL,
    "User_id" TEXT NOT NULL,
    "Block_Id" TEXT NOT NULL,
    "Is_Blocked" BOOLEAN NOT NULL DEFAULT false,
    "DEFAULTER_Attempts" INTEGER NOT NULL DEFAULT 0,
    "PARENT_MAIL" TEXT NOT NULL,
    "PARENT_NAME" TEXT NOT NULL,
    "ADDRESS" TEXT NOT NULL,
    "PARENT_PHONE" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("Roll_No")
);

-- CreateTable
CREATE TABLE "Hostel" (
    "Block_Id" TEXT NOT NULL,
    "CareTaker_Id" TEXT NOT NULL,
    "Warden_Id" TEXT NOT NULL,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("Block_Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Phone_key" ON "User"("Phone");

-- CreateIndex
CREATE UNIQUE INDEX "Student_User_id_key" ON "Student"("User_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_Block_Id_fkey" FOREIGN KEY ("Block_Id") REFERENCES "Hostel"("Block_Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_CareTaker_Id_fkey" FOREIGN KEY ("CareTaker_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hostel" ADD CONSTRAINT "Hostel_Warden_Id_fkey" FOREIGN KEY ("Warden_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_HostelId_fkey" FOREIGN KEY ("HostelId") REFERENCES "Hostel"("Block_Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pass" ADD CONSTRAINT "Pass_RollNo_fkey" FOREIGN KEY ("RollNo") REFERENCES "Student"("Roll_No") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassAction" ADD CONSTRAINT "PassAction_Actor_Id_fkey" FOREIGN KEY ("Actor_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_Roll_No_fkey" FOREIGN KEY ("Roll_No") REFERENCES "Student"("Roll_No") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_Hostel_id_fkey" FOREIGN KEY ("Hostel_id") REFERENCES "Hostel"("Block_Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_Blocked_Role_ID_fkey" FOREIGN KEY ("Blocked_Role_ID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
