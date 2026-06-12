import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface passAction{
    Action_id:string;
    Pass_id:string;
    Actor_id:string;
    Roll_NO:string;
    Action_Type:string;
    Timestamp:string;
}

@Injectable()
export class PassActionsRepository {

    private filePath=path.join(
        process.cwd(),
        'database',
        'pass-actions.json'
    );

    async readActions():Promise<passAction[]>{
        try{
            const data=await fs.readFile(this.filePath,'utf-8');
            if(!data.trim()){
                return [];
            }
            return JSON.parse(data);
        }
        catch{
            await fs.writeFile(this.filePath,"[]");
            return [];
        }
    }

    async writeActions(actions:passAction[]){
        await fs.writeFile(this.filePath,JSON.stringify(actions,null,2));
    }

    async createAction(passId:string,rollNo:string,ActorID:string,action:string){
        const actions=await this.readActions();

        const newAction:passAction={
            Action_id:"ACT-"+uuidv4().slice(0,8),
            Pass_id:passId,
            Actor_id : ActorID ,
            Roll_NO:rollNo,
            Action_Type:action,
            Timestamp:new Date().toISOString()
        };

        actions.unshift(newAction);
        await this.writeActions(actions);

        return newAction;
    }

    async getAllActions(){
        return await this.readActions();
    }

}