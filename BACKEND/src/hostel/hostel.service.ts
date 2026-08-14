import {Injectable,BadRequestException,NotFoundException} from '@nestjs/common';
import { AddHostelBlockDto } from './dto/addhostel.dto';
import { AuthService } from '../auth/auth.service';
import { AuthRepository } from '../auth/auth.repository';
import { HostelRepository } from './hostel.repository';
import { UserRole } from '../auth/dto/login.dto';
import { promises } from 'dns';

@Injectable()
export class HostelService {

    constructor(
        private authservice: AuthService,
        private authrepo: AuthRepository,
        private hostelrepo: HostelRepository,
    ) {}

    async addHostel(hostel: AddHostelBlockDto){
        const existing = await this.hostelrepo.findById(hostel.Block_Id);
        if (existing) {
            throw new BadRequestException(
                'Hostel already exists',
            );
        }
        const careTaker =
            await this.authservice.signup({
                Name: hostel.CareTaker_Name,
                Email: hostel.CareTaker_Email,
                PhoneNo: hostel.CareTaker_PhoneNo,
                password: hostel.CareTaker_Password,
                role: UserRole.CARETAKER,
            });
        const warden =
            await this.authservice.signup({
                Name: hostel.Warden_Name,
                Email: hostel.Warden_Email,
                PhoneNo: hostel.Warden_PhoneNo,
                password:
                    hostel.Warden_Password,
                role: UserRole.WARDEN,
            });
        await this.hostelrepo.addHostel({
            Block_Id: hostel.Block_Id,
            CareTaker_ID:
                String(careTaker.UserID),
            Warden_ID:
                String(warden.UserID),
        });

        return {message:'Hostel added successfully'};
    }

    async deleteHostel(HostelID: string){
        const hostel = await this.hostelrepo.findById(HostelID);
        if (!hostel) {
            throw new NotFoundException(
                'Hostel not found',
            );
        }
        await this.authrepo.deleteUser(hostel.CareTaker_Id);
        await this.authrepo.deleteUser(hostel.Warden_Id);
        await this.hostelrepo.deleteHostel(HostelID);
        return {message:'Hostel deleted successfully'};
    }

    async updateHostel(hostel: AddHostelBlockDto){
        const existing = await this.hostelrepo.findById(hostel.Block_Id);
        if (!existing) {
            throw new NotFoundException(
                'Hostel not found',
            );
        }
        await this.authrepo.updateUser(
            existing.CareTaker_Id,
            {
                Name:
                    hostel.CareTaker_Name,
                Email:
                    hostel.CareTaker_Email,
                PhoneNo:
                    hostel.CareTaker_PhoneNo,
            },
        );
        await this.authrepo.updateUser(
            existing.Warden_Id,
            {
                Name:
                    hostel.Warden_Name,
                Email:
                    hostel.Warden_Email,
                PhoneNo:
                    hostel.Warden_PhoneNo,
            },
        );
        return {message:'Hostel updated successfully'};
    }

    async getAllHostels() {
        const hostels = await this.hostelrepo.getAll();

        const result = await Promise.all(
            hostels.map(async (hostel) => {
                const [caretaker, warden] = await Promise.all([
                    this.authrepo.findUserById(hostel.CareTaker_Id),
                    this.authrepo.findUserById(hostel.Warden_Id),
                ]);

                return {
                    Block_Id: hostel.Block_Id,
                    CareTaker: caretaker,
                    Warden: warden,
                };
            })
        );

        return result;
        }

    async getMe(email: string,role: string):Promise<any>{
        const user = await this.authrepo.findUserByEmail(email);
        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }
        const hostels = await this.hostelrepo.getAll();
        const hostel = hostels.find(h => role === UserRole.CARETAKER ? h.CareTaker_Id === user.Id : h.Warden_Id === user.Id);
        return {user,hostel};
    }

}