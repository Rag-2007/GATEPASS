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
exports.BlockedRepository = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let BlockedRepository = class BlockedRepository {
    constructor() {
        this.filePath = path.join(process.cwd(), 'database', 'blocked.json');
    }
    async readBlocked() {
        const data = await fs.readFile(this.filePath, 'utf-8');
        if (!data.trim()) {
            return [];
        }
        return JSON.parse(data);
    }
    async writeBlocked(passes) {
        await fs.writeFile(this.filePath, JSON.stringify(passes, null, 2));
    }
    async createBlocked(createBlockedDto) {
        const blocked = await this.readBlocked();
        const block = {
            Roll_NO: createBlockedDto.Roll_NO,
            Hostel_id: createBlockedDto.Hostel_id,
            Blocked_Role_id: null,
            Blocked_At: new Date().toISOString(),
            Unblocked_At: null
        };
        blocked.push(block);
        await this.writeBlocked(blocked);
        return block;
    }
    async unblockStudent(rollNo, blockedRoleId) {
        const blocked = await this.readBlocked();
        const index = blocked.findIndex(b => b.Roll_NO === rollNo && b.Unblocked_At === null);
        if (index === -1) {
            throw new Error("Blocked entry not found");
        }
        blocked[index].Unblocked_At = new Date().toISOString();
        blocked[index].Blocked_Role_id = blockedRoleId;
        await this.writeBlocked(blocked);
        return blocked[index];
    }
    async getBlockedStudents() {
        const blocked = await this.readBlocked();
        return blocked.filter(b => b.Unblocked_At === null);
    }
};
exports.BlockedRepository = BlockedRepository;
exports.BlockedRepository = BlockedRepository = __decorate([
    (0, common_1.Injectable)()
], BlockedRepository);
