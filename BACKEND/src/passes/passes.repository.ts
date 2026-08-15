import { Injectable } from '@nestjs/common';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus } from './dto/update-pass.dto';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
interface pass {
    passID: string;
    RollNo: string;
    passType: "DAY_PASS" | "HOME_PASS";
    HostelId: string;
    RaisedAt: Date;
    Destination: string;
    Purpose: string;
    ModeofTransport: string;
    QRCODE: string;
    Status: PassStatus;
    Expected_Date: string;
    Expected_Time: string;
    Actual_Return_Date: string | null;
    Actual_Return_Time: string | null;
}

@Injectable()
export class PassesRepository {
    constructor(private readonly prisma: PrismaService,) { }

    async getAllPasses() {
        return this.prisma.pass.findMany();
    }

    async getPassByQRId(id: string) {

        return this.prisma.pass.findUnique({
            where: {
                QRCODE: id
            }
        });
    }

    async IsPassActive(rollNo: string, Pass_type: "DAY_PASS" | "HOME_PASS"): Promise<boolean> {

        return !!(await this.prisma.pass.findFirst({
            where: {
                RollNo: rollNo,
                passType: Pass_type,
                Status: {
                    in: [PassStatus.PENDING, PassStatus.Parentapproved, PassStatus.CareTakerapproved, PassStatus.CHECKEDOUT]
                }
            }
        }));
    }

    async getPassByPassId(id: string) {
        return this.prisma.pass.findUnique({
            where: {
                passID: id
            }
        });
    }

    async getByHostel(id: string) {
        return await this.prisma.pass.findMany({
            where: {
                student: {
                    Block_Id: id,
                },
            },
            include: {
                student: true,
            },
        });
    }

    async getByStatus(status: PassStatus) {

        return this.prisma.pass.findMany({
            where: {
                Status: status
            }
        });
    }

    async getMyPasses(rollNo: string) {
        return this.prisma.pass.findMany({
            where: {
                RollNo: rollNo,
                Status: {
                    not: PassStatus.CHECKEDIN
                }
            }
        });
    }

    async getByHostelStatus(id: string, status: PassStatus) {

        return await this.prisma.pass.findMany({
            where: {
                student: {
                    Block_Id: id,
                },
                Status: status,
            },
            include: {
                student: true,
            },
        });
    }

    async cancelPass(id: string) {

        return await this.prisma.pass.update({
            where: {
                passID: id,
            },
            data: {
                Status: PassStatus.CANCELLED,
            },
        });
    }

    async approveParent(id: string) {

        return await this.prisma.pass.update({
            where: {
                passID: id
            }
            ,
            data: {
                Status: PassStatus.Parentapproved
            }
        });
    }

    async approveCaretaker(id: string) {

        return await this.prisma.pass.update({
            where: {
                passID: id
            },
            data: {
                Status: PassStatus.CareTakerapproved
            }
        });

    }

    async checkout(id: string) {

        return await this.prisma.pass.update({
            where: {
                passID: id
            },
            data: {
                Status: PassStatus.CHECKEDOUT
            }
        });
    }

    async checkin(id: string) {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset);

        return this.prisma.pass.update({
            where: {
                passID: id,
            },
            data: {
                Status: PassStatus.CHECKEDIN,
                Actual_Return_Date: istTime.toISOString().split("T")[0],
                Actual_Return_Time: istTime.toISOString().split("T")[1].split(".")[0],
            },
        });
    }

    async createPass(createPass: CreatePassDto, rollNo: string) {
        const y = uuidv4().slice(0, 8);
        const status = createPass.passtype === "DAY_PASS" ? PassStatus.CareTakerapproved : PassStatus.PENDING;
        return await this.prisma.pass.create({
            data: {
                RollNo: rollNo,
                passType: createPass.passtype,
                Destination: createPass.destination,
                Purpose: createPass.purpose,
                ModeofTransport: createPass.modeOfTransport,
                QRCODE: `QR-${y}`,
                Status: status,
                Expected_Date: createPass.expectedDate,
                Expected_Time: createPass.expectedTime,
                Actual_Return_Date: null,
                Actual_Return_Time: null,
            },
        });
    }

}
