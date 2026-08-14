-- CreateEnum
CREATE TYPE "PassType" AS ENUM ('DayPass', 'HomePass');

-- CreateEnum
CREATE TYPE "PassStatus" AS ENUM ('Pending', 'ParentApproved', 'CaretakerApproved', 'Active', 'Completed', 'Rejected', 'Cancelled');

-- CreateTable
CREATE TABLE "Pass" (
    "passID" TEXT NOT NULL,
    "RollNo" TEXT NOT NULL,
    "passType" "PassType" NOT NULL,
    "HostelId" TEXT NOT NULL,
    "RaisedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Destination" TEXT NOT NULL,
    "Purpose" TEXT NOT NULL,
    "ModeofTransport" TEXT NOT NULL,
    "QRCODE" TEXT NOT NULL,
    "Status" "PassStatus" NOT NULL DEFAULT 'Pending',
    "Expected_Date" TEXT NOT NULL,
    "Expected_Time" TEXT NOT NULL,
    "Actual_Return_Date" TEXT,
    "Actual_Return_Time" TEXT,

    CONSTRAINT "Pass_pkey" PRIMARY KEY ("passID")
);

-- CreateTable
CREATE TABLE "PassAction" (
    "Action_id" TEXT NOT NULL,
    "passID" TEXT NOT NULL,
    "Actor_id" TEXT NOT NULL,
    "Roll_NO" TEXT NOT NULL,
    "Action_Type" TEXT NOT NULL,
    "Timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PassAction_pkey" PRIMARY KEY ("Action_id")
);

-- CreateTable
CREATE TABLE "Blocked" (
    "id" SERIAL NOT NULL,
    "Roll_No" TEXT NOT NULL,
    "Hostel_id" TEXT NOT NULL,
    "Blocked_Role_id" TEXT NOT NULL,
    "BlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UnblockedAt" TIMESTAMP(3),

    CONSTRAINT "Blocked_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pass_QRCODE_key" ON "Pass"("QRCODE");

-- AddForeignKey
ALTER TABLE "PassAction" ADD CONSTRAINT "PassAction_passID_fkey" FOREIGN KEY ("passID") REFERENCES "Pass"("passID") ON DELETE RESTRICT ON UPDATE CASCADE;
