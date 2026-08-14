import { Injectable } from '@nestjs/common';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus,UpdatePassDto } from './dto/update-pass.dto';
import { PassesRepository } from './passes.repository';
import { PassActionsRepository } from './passactions.repository';
import { AuthRepository } from '../auth/auth.repository';
import { StudentRepository } from '../student/student.repository';

@Injectable()
export class PassesService {

    constructor(
      private readonly passesRepository:PassesRepository,
      private readonly passActionsRepository: PassActionsRepository,
      private readonly authRepository: AuthRepository,
      private readonly studentRepository: StudentRepository
    ){}

    async getAllPasses():Promise<any>{
        return await this.passesRepository.getAllPasses();
    }

    async getByHostel(id:string):Promise<any>{
        return await this.passesRepository.getByHostel(id);
    }

    async getByStatus(status:PassStatus):Promise<any>{
        return await this.passesRepository.getByStatus(status);
    }

    async getMyPasses(email:string):Promise<any>{
        const userid = await this.authRepository.findUID(email);
        if(!userid){
            throw new Error("User not found");
        }
        const studentData = await this.studentRepository.findByUserId(userid);
        if(!studentData){
            throw new Error("Student not found");
        }
        const rollNo = studentData.Roll_No;
        return await this.passesRepository.getMyPasses(rollNo);
    }

    async getByHostelStatus(id:string,status:PassStatus):Promise<any>{
        return await this.passesRepository.getByHostelStatus(id,status);
    }

    async getPassActions():Promise<any>{
        return await this.passActionsRepository.getAllActions();
    }

    async createPass(CreatePass:CreatePassDto,email:string):Promise<any>{

        const userid = await this.authRepository.findUID(email);
        if(!userid){
            throw new Error("User not found");
        }
        const studentData = await this.studentRepository.findByUserId(userid);
        if(!studentData){
            throw new Error("Student not found");
        }
        if(studentData.Is_Blocked){
          throw new Error("Student is currently blocked from raising passes");
        }
        const rollNo = studentData.Roll_No;
        if(await this.passesRepository.IsPassActive(rollNo,CreatePass.passtype)){
          throw new Error("Pass Already active for this student");
        }

        return await this.passesRepository.createPass(CreatePass,rollNo);

    }

    async cancelPass(id:string,email:string):Promise<any>{
        const found = await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status===PassStatus.CHECKEDIN || found.Status===PassStatus.CHECKEDOUT){
            throw new Error("Only proccesing pass can be cancelled");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.Id;
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if(!student){
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(id, uid, `Pass Cancelled in ${studentBlockId}`);
        return await this.passesRepository.cancelPass(id);
    }

    async approveParent(id:string):Promise<any>{
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.PENDING){
            throw new Error("Only pending pass can be approved");
        }
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if(!student){
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(id, 'Parent', `Parent Approved in ${studentBlockId}`);
        return await this.passesRepository.approveParent(id);
    }

    async approveCaretaker(id:string,email:string):Promise<any>{
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.Parentapproved){
            throw new Error("Parent approval required");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.Id;
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if(!student){
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(id, uid, `Caretaker Approved in ${studentBlockId}`);
        return await this.passesRepository.approveCaretaker(id);

    }

    async checkout(id:string,email:string):Promise<any>{
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }
        if(found.Status!==PassStatus.CareTakerapproved){
            throw new Error("Pass not approved");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.Id;
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if(!student){
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(id, uid, `Pass Checked Out at ${studentBlockId}`);
        return await this.passesRepository.checkout(id);

    }
 
    async checkin(id:string,email:string):Promise<any>{
        const found=await this.passesRepository.getPassById(id);
        if(!found){
            throw new Error("Pass not found");
        }

        const expectedDateTime = new Date(`${found.Expected_Date}T${found.Expected_Time}:00`);
        const now = new Date();
        if(now > expectedDateTime){
            await this.studentRepository.incrementDefaulterAttempts(found.RollNo);
        }

        if(found.Status!==PassStatus.CHECKEDOUT){
            throw new Error("Student not checked out");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.Id;
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if(!student){
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(id, uid, `Pass Checked In at ${studentBlockId}`);
        return await this.passesRepository.checkin(id);

    }

}