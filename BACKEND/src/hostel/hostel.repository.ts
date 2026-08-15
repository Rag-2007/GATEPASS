import { Injectable } from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";

interface Hostel {
    Block_Id: string;
    CareTaker_ID: string;
    Warden_ID: string;
}

@Injectable()
export class HostelRepository {
    constructor(private readonly prisma: PrismaService,){}

    async findById(blockId: string){
        return await this.prisma.hostel.findFirst({
            where: {
                Block_Id: blockId
            }
        });
    }

    async addHostel(hostel: Hostel){
        return await this.prisma.hostel.create({
            data: {
                Block_Id: hostel.Block_Id,
                CareTaker_Id: hostel.CareTaker_ID,
                Warden_Id: hostel.Warden_ID
            }
        });
    }

    async deleteHostel(blockId: string){
        return await this.prisma.hostel.delete({
            where: {
                Block_Id: blockId
            }
        });
    }

    async updateHostel(blockId: string, updatedData: Partial<Hostel>){
        return await this.prisma.hostel.update({
            where: {
                Block_Id: blockId
            },
            data: updatedData
        });
    }

    async getAll() {
        return await this.prisma.hostel.findMany();
    }

}
