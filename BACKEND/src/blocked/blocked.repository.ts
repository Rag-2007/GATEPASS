import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';   
import { CreateBlockedDto } from './dto/create-blocked.dto';

export interface blocked{
    Roll_NO:string;
    Hostel_id:string;
    Blocked_Role_id:string | null;
    Blocked_At:string;
    Unblocked_At:string | null;
}

@Injectable()
export class BlockedRepository {

    private filePath=path.join(
        process.cwd(),
        'database',
        'blocked.json'
    );
    async readBlocked():Promise<blocked[]>{
        const data=await fs.readFile(this.filePath,'utf-8');
        if(!data.trim()){
            return [];
        }
        return JSON.parse(data);
    }

    async writeBlocked(passes:blocked[]){
        await fs.writeFile(
            this.filePath,
            JSON.stringify(passes,null,2)
        );
    }

    async createBlocked(createBlockedDto:CreateBlockedDto):Promise<blocked>{
        const blocked= await this.readBlocked();
        const block:blocked={
            Roll_NO:createBlockedDto.Roll_NO,
            Hostel_id:createBlockedDto.Hostel_id,
            Blocked_Role_id: null,
            Blocked_At:new Date().toISOString(),
            Unblocked_At:null
        };
        blocked.push(block);
        await this.writeBlocked(blocked);
        return block;
    }

    async unblockStudent(rollNo : string, blockedRoleId: string):Promise<blocked>{
        const blocked= await this.readBlocked();
        const index=blocked.findIndex(
            b => b.Roll_NO===rollNo && b.Unblocked_At===null
        ); 
        if(index===-1){
            throw new Error("Blocked entry not found");
        }
        blocked[index].Unblocked_At=new Date().toISOString();
        blocked[index].Blocked_Role_id=blockedRoleId;
        await this.writeBlocked(blocked);
        return blocked[index];
    }

    async getBlockedStudents():Promise<blocked[]>{
        const blocked= await this.readBlocked();
        return blocked.filter(
            b => b.Unblocked_At===null
        );
    }

}