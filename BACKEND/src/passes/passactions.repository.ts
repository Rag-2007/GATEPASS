import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PassActionsRepository {
    constructor(private readonly prisma: PrismaService,){}
    async createAction(passId:string,ActorID:string,action:string,remarks?:string){
        return await this.prisma.passAction.create({
            data:{
                passID:passId,
                Actor_Id:ActorID,
                Action_Type:action,
                Remarks:remarks
            }
        });
    }
    async getAllActions(){
        return await this.prisma.passAction.findMany({
            orderBy:{
                Timestamp:'desc'
            }
        });
    }
}