import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePassDto } from './dto/create-pass.dto';
import { PassStatus, UpdatePassDto } from './dto/update-pass.dto';
import { PassesRepository } from './passes.repository';
import { PassActionsRepository } from './passactions.repository';
import { AuthRepository } from '../auth/auth.repository';
import { StudentRepository } from '../student/student.repository';
import { PrismaService } from '../prisma/prisma.service';
import { Defaulter } from '../common/defaulter';
import { BlockedService } from 'src/blocked/blocked.service';
import { HostelRepository } from 'src/hostel/hostel.repository';

@Injectable()
export class PassesService {

    constructor(
        private readonly passesRepository: PassesRepository,
        private readonly passActionsRepository: PassActionsRepository,
        private readonly authRepository: AuthRepository,
        private readonly studentRepository: StudentRepository,
        private readonly prisma: PrismaService,
        private readonly defaulter: Defaulter,
        private readonly blockedService: BlockedService,
        private readonly hostelRepository: HostelRepository,
    ) { }

    async getAllPasses(): Promise<any> {
        return await this.passesRepository.getAllPasses();
    }

    async getByHostel(id: string): Promise<any> {
        return await this.passesRepository.getByHostel(id);
    }

    async getByStatus(status: PassStatus): Promise<any> {
        return await this.passesRepository.getByStatus(status);
    }

    async getMyPasses(email: string): Promise<any> {
        const userid = await this.authRepository.findUID(email);
        if (!userid) {
            throw new Error("User not found");
        }
        const studentData = await this.studentRepository.findByUserId(userid);
        if (!studentData) {
            throw new Error("Student not found");
        }
        const rollNo = studentData.Roll_No;
        return await this.passesRepository.getMyPasses(rollNo);
    }

    async getByHostelStatus(id: string, status: PassStatus): Promise<any> {
        return await this.passesRepository.getByHostelStatus(id, status);
    }

    async getPassActions(): Promise<any> {
        return await this.passActionsRepository.getAllActions();
    }

    async rejectPass(id: string, email: string): Promise<any> {
        let found = await this.passesRepository.getPassByPassId(id);
        if (!found) {
            found = await this.passesRepository.getPassByQRId(id);
        }
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status !== PassStatus.Parentapproved) {
            throw new Error("Only Parent-approved passes can be rejected");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user.Id;
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if (!student) {
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(found.passID, uid, `Pass Rejected in ${studentBlockId}`);
        return await this.passesRepository.cancelPass(found.passID);
    }

    async createPass(CreatePass: CreatePassDto, email: string): Promise<any> {

        const userid = await this.authRepository.findUID(email);
        if (!userid) {
            throw new Error("User not found");
        }
        const studentData = await this.studentRepository.findByUserId(userid);
        if (!studentData) {
            throw new Error("Student not found");
        }
        if (studentData.Is_Blocked) {
            throw new HttpException(
                'You are currently blocked from raising passes due to defaulter violations. Please contact your warden.',
                HttpStatus.FORBIDDEN
            );
        }
        const rollNo = studentData.Roll_No;
        if (await this.passesRepository.IsPassActive(rollNo, CreatePass.passtype)) {
            throw new HttpException('A pass of this type is already active. Cancel the existing pass first.', HttpStatus.CONFLICT);
        }

        return await this.passesRepository.createPass(CreatePass, rollNo);

    }

    async cancelPass(id: string, email: string): Promise<any> {
        let found = await this.passesRepository.getPassByPassId(id);
        if (!found) {
            found = await this.passesRepository.getPassByQRId(id);
        }
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status === PassStatus.CHECKEDIN || found.Status === PassStatus.CHECKEDOUT) {
            throw new Error("Only processing pass can be cancelled");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user ? user.Id : null;
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if (!student) {
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(found.passID, uid, 'STUDENT', `Pass Cancelled in ${studentBlockId}`).catch(() => {});
        return await this.passesRepository.cancelPass(found.passID);
    }

    async approveParent(id: string): Promise<any> {
        let found = await this.passesRepository.getPassByPassId(id);
        if (!found) {
            found = await this.passesRepository.getPassByQRId(id);
        }
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status !== PassStatus.PENDING) {
            throw new Error("Only pending pass can be approved");
        }
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if (!student) {
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(found.passID, null, 'PARENT', `Parent Approved in ${studentBlockId}`).catch(() => {});
        return await this.passesRepository.approveParent(found.passID);
    }

    async approveCaretaker(id: string, email: string): Promise<any> {
        let found = await this.passesRepository.getPassByPassId(id);
        if (!found) {
            found = await this.passesRepository.getPassByQRId(id);
        }
        if (!found) {
            throw new Error("Pass not found");
        }
        if (found.Status !== PassStatus.Parentapproved) {
            throw new Error("Parent approval required before caretaker approval");
        }
        const user = await this.authRepository.findUserByEmail(email);
        const uid = user ? user.Id : null;
        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if (!student) {
            throw new Error("Student not found");
        }
        const studentBlockId = student.Block_Id;
        this.passActionsRepository.createAction(found.passID, uid, 'CARETAKER', `Caretaker Approved in ${studentBlockId}`).catch(() => {});
        return await this.passesRepository.approveCaretaker(found.passID);
    }

    async validateScan(mode: string, id: string): Promise<any> {
        const found = await this.passesRepository.getPassByQRId(id);
        if (!found) {
            throw new HttpException('QR code not found. Please check the pass and try again.', HttpStatus.NOT_FOUND);
        }

        if (mode === 'out') {
            if (found.Status === PassStatus.CHECKEDOUT) {
                throw new HttpException('This student has already checked out. Cannot scan out again.', HttpStatus.BAD_REQUEST);
            }
            if (found.Status === PassStatus.CHECKEDIN) {
                throw new HttpException('This student has already returned (Checked In). Pass is complete.', HttpStatus.BAD_REQUEST);
            }
            if (found.Status === PassStatus.PENDING || found.Status === PassStatus.Parentapproved) {
                throw new HttpException('Pass is still pending approval. Cannot check out yet.', HttpStatus.BAD_REQUEST);
            }
            if (found.Status !== PassStatus.CareTakerapproved) {
                throw new HttpException('Pass is not in an approved state for exit.', HttpStatus.BAD_REQUEST);
            }
        } else if (mode === 'in') {
            if (found.Status === PassStatus.CHECKEDIN) {
                throw new HttpException('This student has already returned (Checked In). Pass is complete.', HttpStatus.BAD_REQUEST);
            }
            if (found.Status === PassStatus.CareTakerapproved || found.Status === PassStatus.PENDING) {
                throw new HttpException('This student has not checked out yet. Use SCAN OUT first.', HttpStatus.BAD_REQUEST);
            }
            if (found.Status !== PassStatus.CHECKEDOUT) {
                throw new HttpException('Pass is not in a valid state for check-in.', HttpStatus.BAD_REQUEST);
            }
        }

        const studentWithUser = await this.prisma.student.findUnique({
            where: { Roll_No: found.RollNo },
            include: { user: true },
        });
        if (!studentWithUser) {
            throw new HttpException('Student record not found.', HttpStatus.NOT_FOUND);
        }

        return {
            pass: found,
            student: {
                Roll_No: studentWithUser.Roll_No,
                Name: studentWithUser.user?.Name ?? '—',
                Block_Id: studentWithUser.Block_Id,
            },
        };
    }

    async checkout(id: string): Promise<any> {
        const found = await this.passesRepository.getPassByQRId(id);
        if (!found) {
            throw new HttpException('QR code not found. Please check the pass and try again.', HttpStatus.NOT_FOUND);
        }
        if (found.Status === PassStatus.CHECKEDOUT) {
            throw new HttpException('This student has already checked out. Cannot scan out again.', HttpStatus.BAD_REQUEST);
        }
        if (found.Status === PassStatus.CHECKEDIN) {
            throw new HttpException('This student has already returned (Checked In). Pass is complete.', HttpStatus.BAD_REQUEST);
        }
        if (found.Status === PassStatus.PENDING || found.Status === PassStatus.Parentapproved) {
            throw new HttpException('Pass is still pending approval. Cannot check out yet.', HttpStatus.BAD_REQUEST);
        }
        if (found.Status !== PassStatus.CareTakerapproved) {
            throw new HttpException('Pass is not in an approved state for exit.', HttpStatus.BAD_REQUEST);
        }
        const studentWithUser = await this.prisma.student.findUnique({
            where: { Roll_No: found.RollNo },
            include: { user: true },
        });
        if (!studentWithUser) {
            throw new HttpException('Student record not found.', HttpStatus.NOT_FOUND);
        }
        const studentBlockId = studentWithUser.Block_Id;
        this.passActionsRepository.createAction(found.passID, null, 'SECURITY', `Pass Checked Out at ${studentBlockId}`).catch(() => {});
        const updatedPass = await this.passesRepository.checkout(found.passID);
        return {
            pass: updatedPass,
            student: {
                Roll_No: studentWithUser.Roll_No,
                Name: studentWithUser.user?.Name ?? '—',
                Block_Id: studentWithUser.Block_Id,
            },
        };
    }

    async checkin(id: string): Promise<any> {
        const found = await this.passesRepository.getPassByQRId(id);
        if (!found) {
            throw new HttpException('QR code not found. Please check the pass and try again.', HttpStatus.NOT_FOUND);
        }
        if (found.Status === PassStatus.CHECKEDIN) {
            throw new HttpException('This student has already returned (Checked In). Pass is complete.', HttpStatus.BAD_REQUEST);
        }
        if (found.Status === PassStatus.CareTakerapproved || found.Status === PassStatus.PENDING) {
            throw new HttpException('This student has not checked out yet. Use SCAN OUT first.', HttpStatus.BAD_REQUEST);
        }
        if (found.Status !== PassStatus.CHECKEDOUT) {
            throw new HttpException('Pass is not in a valid state for check-in.', HttpStatus.BAD_REQUEST);
        }

        const student = await this.studentRepository.findByRollNo(found.RollNo);
        if (!student) {
            throw new HttpException('Student record not found.', HttpStatus.NOT_FOUND);
        }

        const expectedDateTime = new Date(`${found.Expected_Date}T${found.Expected_Time}:00`);
        const now = new Date();
        if (now > expectedDateTime) {
            await this.studentRepository.incrementDefaulterAttempts(found.RollNo);

            const updatedStudent = await this.studentRepository.findByRollNo(found.RollNo);
            if (updatedStudent && this.defaulter.isDefaulter(updatedStudent.DEFAULTER_Attempts)) {
                try {
                    const hostel = await this.hostelRepository.findById(student.Block_Id);
                    if (hostel) {
                        await this.blockedService.createBlocked({
                            Roll_No: found.RollNo,
                            Hostel_id: student.Block_Id,
                            Blocked_Role_ID: hostel.CareTaker_Id,
                        });
                    }
                } catch (_) {
                    // Student may already be blocked — ignore, don't crash
                }
            }
        }

        const studentBlockId = student.Block_Id;

        this.passActionsRepository.createAction(found.passID, null, 'SECURITY', `Pass Checked In at ${studentBlockId}`).catch(() => {});

        const updatedPass = await this.passesRepository.checkin(found.passID);
        return {
            pass: updatedPass,
            student: {
                Roll_No: student.Roll_No,
                Block_Id: student.Block_Id,
            },
        };
    }
}
