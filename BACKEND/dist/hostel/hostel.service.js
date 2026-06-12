"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostelService = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const auth_repository_1 = require("../auth/auth.repository");
const hostel_repository_1 = require("./hostel.repository");
const login_dto_1 = require("../auth/dto/login.dto");
let HostelService = class HostelService {
    constructor(authservice, authrepo, hostelrepo) {
        this.authservice = authservice;
        this.authrepo = authrepo;
        this.hostelrepo = hostelrepo;
    }
    async addHostel(hostel) {
        const existing = await this.hostelrepo.findById(hostel.Block_Id);
        if (existing) {
            throw new common_1.BadRequestException('Hostel already exists');
        }
        const careTaker = await this.authservice.signup({
            Name: hostel.CareTaker_Name,
            Email: hostel.CareTaker_Email,
            PhoneNo: hostel.CareTaker_PhoneNo,
            password: hostel.CareTaker_Password,
            role: login_dto_1.UserRole.CARETAKER,
        });
        const warden = await this.authservice.signup({
            Name: hostel.Warden_Name,
            Email: hostel.Warden_Email,
            PhoneNo: hostel.Warden_PhoneNo,
            password: hostel.Warden_Password,
            role: login_dto_1.UserRole.WARDEN,
        });
        await this.hostelrepo.addHostel({
            Block_Id: hostel.Block_Id,
            CareTaker_ID: String(careTaker.UserID),
            Warden_ID: String(warden.UserID),
        });
        return { message: 'Hostel added successfully' };
    }
    async deleteHostel(HostelID) {
        const hostel = await this.hostelrepo.findById(HostelID);
        if (!hostel) {
            throw new common_1.NotFoundException('Hostel not found');
        }
        await this.authrepo.deleteUser(hostel.CareTaker_ID);
        await this.authrepo.deleteUser(hostel.Warden_ID);
        await this.hostelrepo.deleteHostel(HostelID);
        return { message: 'Hostel deleted successfully' };
    }
    async updateHostel(hostel) {
        const existing = await this.hostelrepo.findById(hostel.Block_Id);
        if (!existing) {
            throw new common_1.NotFoundException('Hostel not found');
        }
        await this.authrepo.updateUser(existing.CareTaker_ID, {
            Name: hostel.CareTaker_Name,
            Email: hostel.CareTaker_Email,
            PhoneNo: hostel.CareTaker_PhoneNo,
        });
        await this.authrepo.updateUser(existing.Warden_ID, {
            Name: hostel.Warden_Name,
            Email: hostel.Warden_Email,
            PhoneNo: hostel.Warden_PhoneNo,
        });
        return { message: 'Hostel updated successfully' };
    }
    async getAllHostels() {
        const hostels = await this.hostelrepo.getAll();
        let result = [];
        for (const hostel of hostels) {
            const caretaker = await this.authrepo.findUserById(hostel.CareTaker_ID);
            const warden = await this.authrepo.findUserById(hostel.Warden_ID);
            result.push({
                Block_Id: hostel.Block_Id,
                CareTaker: caretaker,
                Warden: warden,
            });
        }
        return result;
    }
    async getMe(email, role) {
        const user = await this.authrepo.findUserByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const hostels = await this.hostelrepo.getAll();
        const hostel = hostels.find(h => role === login_dto_1.UserRole.CARETAKER ? h.CareTaker_ID === user.USER_ID : h.Warden_ID === user.USER_ID);
        return { user, hostel };
    }
};
exports.HostelService = HostelService;
exports.HostelService = HostelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        auth_repository_1.AuthRepository,
        hostel_repository_1.HostelRepository])
], HostelService);
