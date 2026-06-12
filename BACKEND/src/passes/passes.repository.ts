import { Injectable } from '@nestjs/common';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus } from './dto/update-pass.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

interface pass{
    passId:string;
    RollNo:string;
    passtype:"DAY_PASS" | "HOME_PASS";
    HostelId:string;
    RaisedAt:Date;
    Destination:string;
    Purpose:string;
    ModeofTransport:string;
    QRCODE:string;
    Status:PassStatus;
    Expected_Date:string;
    Expected_Time:string;
    Actual_Return_Date:string | null;
    Actual_Return_Time:string | null;
}

@Injectable()
export class PassesRepository {

    private filePath=path.join(
        process.cwd(),
        'database',
        'passes.json'
    );

    async readPasses():Promise<pass[]>{
        const data=await fs.readFile(this.filePath,'utf-8');
        if(!data.trim()){
            return [];
        }
        return JSON.parse(data);
    }

    async writePasses(passes:pass[]){
        await fs.writeFile(
            this.filePath,
            JSON.stringify(passes,null,2)
        );
    }

    async getAllPasses():Promise<pass[]>{

        return await this.readPasses();

    }

    async getPassById(id:string){

        const passes=await this.readPasses();
        return passes.find(
            p => p.passId===id
        );
    }

    async IsPassActive(rollNo:string,Pass_type:"DAY_PASS" | "HOME_PASS"): Promise<boolean> {

        const passes=await this.readPasses();   
        return !!passes.find(
            p => p.RollNo===rollNo &&
            p.passtype===Pass_type &&
            (p.Status===PassStatus.PENDING || p.Status===PassStatus.Parentapproved
                 || p.Status===PassStatus.CareTakerapproved || p.Status===PassStatus.CHECKEDOUT)
        )
        
    }
    async getByHostel(id:string){

        const passes=await this.readPasses();
        return passes.filter(
            p => p.HostelId===id
        );
    }

    async getByStatus(status:PassStatus){

        const passes=await this.readPasses();
        return passes.filter(
            p => p.Status===status
        );
    }

    async getMyPasses(rollNo:string){

        const passes=await this.readPasses();
        return passes.filter(
            p => p.RollNo===rollNo
        );
    }

    async getByHostelStatus(id:string,status:PassStatus){

        const passes=await this.readPasses();
        return passes.filter(
            p => p.HostelId===id &&
            p.Status===status
        );
    }

    async cancelPass(id:string):Promise<pass>{

        const passes=await this.readPasses();
        const found=passes.find(p => p.passId===id);

        if(!found){
            throw new Error("Pass not found");
        }

        found.Status=PassStatus.CANCELLED;
        await this.writePasses(passes);

        return found;
    }

    async approveParent(id:string):Promise<pass>{

        const passes=await this.readPasses();
        const found=passes.find(p => p.passId===id);

        if(!found){
            throw new Error("Pass not found");
        }

        found.Status=PassStatus.Parentapproved;
        await this.writePasses(passes);

        return found;
    }

    async approveCaretaker(id:string):Promise<pass>{

        const passes=await this.readPasses();
        const found=passes.find(p => p.passId===id);
        if(!found){
            throw new Error("Pass not found");
        }
        found.Status=PassStatus.CareTakerapproved;
        await this.writePasses(passes);

        return found;
    }

    async checkout(id:string):Promise<pass>{

        const passes=await this.readPasses();
        const found=passes.find(p => p.passId===id);
        if(!found){
            throw new Error("Pass not found");
        }

        found.Status=PassStatus.CHECKEDOUT;
        await this.writePasses(passes);

        return found;
    }

    async checkin(id:string):Promise<pass>{

        const passes=await this.readPasses();
        const found=passes.find(p => p.passId===id);
        if(!found){
            throw new Error("Pass not found");
        }

        found.Status=PassStatus.CHECKEDIN;
        found.Actual_Return_Date=new Date().toISOString().split('T')[0];
        found.Actual_Return_Time=new Date().toISOString().split('T')[1].split('.')[0];
        
        await this.writePasses(passes);
        return found;
    }

    async createPass(CreatePass:CreatePassDto,rollNo:string):Promise<pass>{

        const passes=await this.readPasses();
        const y=uuidv4().slice(0,8);

        const newpass:pass={
            passId:"P-id"+y,
            RollNo:rollNo,
            passtype:CreatePass.passtype,
            HostelId:"BH-1",
            RaisedAt:new Date(),
            Destination:CreatePass.destination,
            Purpose:CreatePass.purpose,
            ModeofTransport:CreatePass.modeOfTransport,
            QRCODE:"QR-"+y,
            Status: CreatePass.passtype==="DAY_PASS" ? PassStatus.CareTakerapproved : PassStatus.PENDING,
            Expected_Date:CreatePass.expectedDate,
            Expected_Time:CreatePass.expectedTime,
            Actual_Return_Date:null,
            Actual_Return_Time:null
        };
        passes.push(newpass);
        await this.writePasses(passes);

        return newpass;
    }

}