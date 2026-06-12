"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassesRepository = void 0;
const common_1 = require("@nestjs/common");
const update_pass_dto_1 = require("./dto/update-pass.dto");
const uuid_1 = require("uuid");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let PassesRepository = class PassesRepository {
    constructor() {
        this.filePath = path.join(process.cwd(), 'database', 'passes.json');
    }
    async readPasses() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        if (!data.trim()) {
            return [];
        }
        return JSON.parse(data);
    }
    async writePasses(passes) {
        await fs.writeFile(this.filePath, JSON.stringify(passes, null, 2));
    }
    async getAllPasses() {
        return await this.readPasses();
    }
    async getPassById(id) {
        const passes = await this.readPasses();
        return passes.find(p => p.passId === id);
    }
    async IsPassActive(rollNo, Pass_type) {
        const passes = await this.readPasses();
        return !!passes.find(p => p.RollNo === rollNo &&
            p.passtype === Pass_type &&
            (p.Status === update_pass_dto_1.PassStatus.PENDING || p.Status === update_pass_dto_1.PassStatus.Parentapproved
                || p.Status === update_pass_dto_1.PassStatus.CareTakerapproved || p.Status === update_pass_dto_1.PassStatus.CHECKEDOUT));
    }
    async getByHostel(id) {
        const passes = await this.readPasses();
        return passes.filter(p => p.HostelId === id);
    }
    async getByStatus(status) {
        const passes = await this.readPasses();
        return passes.filter(p => p.Status === status);
    }
    async getMyPasses(rollNo) {
        const passes = await this.readPasses();
        return passes.filter(p => p.RollNo === rollNo);
    }
    async getByHostelStatus(id, status) {
        const passes = await this.readPasses();
        return passes.filter(p => p.HostelId === id &&
            p.Status === status);
    }
    async cancelPass(id) {
        const passes = await this.readPasses();
        const found = passes.find(p => p.passId === id);
        if (!found) {
            throw new Error("Pass not found");
        }
        found.Status = update_pass_dto_1.PassStatus.CANCELLED;
        await this.writePasses(passes);
        return found;
    }
    async approveParent(id) {
        const passes = await this.readPasses();
        const found = passes.find(p => p.passId === id);
        if (!found) {
            throw new Error("Pass not found");
        }
        found.Status = update_pass_dto_1.PassStatus.Parentapproved;
        await this.writePasses(passes);
        return found;
    }
    async approveCaretaker(id) {
        const passes = await this.readPasses();
        const found = passes.find(p => p.passId === id);
        if (!found) {
            throw new Error("Pass not found");
        }
        found.Status = update_pass_dto_1.PassStatus.CareTakerapproved;
        await this.writePasses(passes);
        return found;
    }
    async checkout(id) {
        const passes = await this.readPasses();
        const found = passes.find(p => p.passId === id);
        if (!found) {
            throw new Error("Pass not found");
        }
        found.Status = update_pass_dto_1.PassStatus.CHECKEDOUT;
        await this.writePasses(passes);
        return found;
    }
    async checkin(id) {
        const passes = await this.readPasses();
        const found = passes.find(p => p.passId === id);
        if (!found) {
            throw new Error("Pass not found");
        }
        found.Status = update_pass_dto_1.PassStatus.CHECKEDIN;
        found.Actual_Return_Date = new Date().toISOString().split('T')[0];
        found.Actual_Return_Time = new Date().toISOString().split('T')[1].split('.')[0];
        await this.writePasses(passes);
        return found;
    }
    async createPass(CreatePass, rollNo) {
        const passes = await this.readPasses();
        const y = (0, uuid_1.v4)().slice(0, 8);
        const newpass = {
            passId: "P-id" + y,
            RollNo: rollNo,
            passtype: CreatePass.passtype,
            HostelId: "BH-1",
            RaisedAt: new Date(),
            Destination: CreatePass.destination,
            Purpose: CreatePass.purpose,
            ModeofTransport: CreatePass.modeOfTransport,
            QRCODE: "QR-" + y,
            Status: CreatePass.passtype === "DAY_PASS" ? update_pass_dto_1.PassStatus.CareTakerapproved : update_pass_dto_1.PassStatus.PENDING,
            Expected_Date: CreatePass.expectedDate,
            Expected_Time: CreatePass.expectedTime,
            Actual_Return_Date: null,
            Actual_Return_Time: null
        };
        passes.push(newpass);
        await this.writePasses(passes);
        return newpass;
    }
};
exports.PassesRepository = PassesRepository;
exports.PassesRepository = PassesRepository = __decorate([
    (0, common_1.Injectable)()
], PassesRepository);
