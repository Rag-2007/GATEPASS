import { Injectable } from '@nestjs/common';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlockedRepository {
    constructor(private readonly prisma: PrismaService,){}

    async createBlocked(createBlockedDto:CreateBlockedDto){
        return await this.prisma.blocked.create({
            data:{
                Roll_No:createBlockedDto.Roll_No,
                Hostel_id:createBlockedDto.Hostel_id,
                Blocked_Role_ID: createBlockedDto.Blocked_Role_ID,
            }
        });
    }

    async unblockStudent(rollNo : string, blockedRoleId: string){
        const blocked = await this.prisma.blocked.findFirst({
            where: {
                Roll_No: rollNo,
                UnblockedAt: null,
            }
        });

        if (!blocked) {
            return null;
        }

        return await this.prisma.blocked.update({
            where: {
                id: blocked.id,
            },
            data: {
                Blocked_Role_ID: blockedRoleId,
                UnblockedAt: new Date(),
            }
        });
    }

    async getBlockedStudents(){
        return await this.prisma.blocked.findMany({
            where:{
                UnblockedAt:null
            }
        });
    }

}