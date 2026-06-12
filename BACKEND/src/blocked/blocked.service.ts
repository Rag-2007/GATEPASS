import { Injectable } from '@nestjs/common';
import { CreateBlockedDto } from './dto/create-blocked.dto';
import { UpdateBlockedDto } from './dto/update-blocked.dto';
import { BlockedRepository } from './blocked.repository';
import { blocked } from './blocked.repository';
import { StudentRepository } from '../student/student.repository';

@Injectable()
export class BlockedService {

  constructor(
    private readonly blockedRepository: BlockedRepository,
    private readonly studentRepository: StudentRepository
  ){}

  async getAllBlocked() : Promise<blocked[]> {
    return await this.blockedRepository.getBlockedStudents();
  }

  async createBlocked(createBlockedDto: CreateBlockedDto) : Promise<blocked>{
    const student =await this.studentRepository.findByRollNo(createBlockedDto.Roll_NO);
    if(!student){
      throw new Error("Student not found");
    }
    if(student.IS_BLOCKED){
      throw new Error("Student is already blocked");
    }
    if(!student.IS_BLOCKED){
      await this.studentRepository.updateBlockedStatus(createBlockedDto.Roll_NO, true);
    }
    return await this.blockedRepository.createBlocked(createBlockedDto);
  }

  async unblockStudent(rollNo: string, updateBlockedDto: UpdateBlockedDto) : Promise<blocked>{
    const student = await this.studentRepository.findByRollNo(rollNo);
    if(!student){
      throw new Error("Student not found");
    }
    if(!student.IS_BLOCKED){
      throw new Error("Student is not currently blocked");
    } 
    if(!updateBlockedDto.Blocked_Role_id){
      throw new Error("Blocked_Role_id is required for unblocking");
    }
    await this.studentRepository.resetDefaulterAttempts(rollNo);
    await this.studentRepository.updateBlockedStatus(rollNo, false);
    return await this.blockedRepository.unblockStudent(rollNo,updateBlockedDto.Blocked_Role_id);
  }

}
