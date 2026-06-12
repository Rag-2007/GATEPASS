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
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path = __importStar(require("path"));
let AuthRepository = class AuthRepository {
    constructor() {
        this.filePath = path.join(process.cwd(), 'database', 'users.json');
    }
    async readUsers() {
        const data = await fs_1.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    }
    async writeUsers(users) {
        await fs_1.promises.writeFile(this.filePath, JSON.stringify(users, null, 2));
    }
    async findUserByEmail(email) {
        const users = await this.readUsers();
        const user = users.find(u => u.Email === email);
        if (!user) {
            throw new common_1.NotFoundException("User Not Found");
        }
        return user;
    }
    async createUser(userData) {
        const users = await this.readUsers();
        const nextId = users.length === 0 ? 1 : Math.max(...users.map(u => Number(u.USER_ID))) + 1;
        const user = Object.assign({ USER_ID: String(nextId) }, userData);
        users.push(user);
        await this.writeUsers(users);
        return nextId;
    }
    async deleteUser(userId) {
        const users = await this.readUsers();
        const updatedUsers = users.filter(u => u.USER_ID !== userId);
        await this.writeUsers(updatedUsers);
    }
    async updateUser(userId, updatedData) {
        const users = await this.readUsers();
        const index = users.findIndex(u => u.USER_ID === userId);
        if (index === -1) {
            return null;
        }
        users[index] = Object.assign(Object.assign({}, users[index]), updatedData);
        await this.writeUsers(users);
        return users[index];
    }
    async findOne(email, role) {
        const users = await this.readUsers();
        const user = users.find(u => u.Email === email && u.Role === role);
        return user ? user.Password_Hash : null;
    }
    async findUID(email) {
        const users = await this.readUsers();
        const user = users.find(u => u.Email === email);
        return user ? user.USER_ID : null;
    }
    async setRefreshToken(UserID, hash) {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === UserID);
        if (user) {
            user.RefreshToken = hash;
            await this.writeUsers(users);
        }
    }
    async deleteToken(UserID) {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === UserID);
        if (user) {
            user.RefreshToken = null;
            await this.writeUsers(users);
        }
    }
    async findRole(userid) {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === userid);
        return user ? user.Role : null;
    }
    async findEmail(userid) {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === userid);
        return user ? user.Email : null;
    }
    async getRefreshToken(userid) {
        const users = await this.readUsers();
        const user = users.find(u => u.USER_ID === userid);
        return user ? user.RefreshToken : null;
    }
    async findUserById(userId) {
        const users = await this.readUsers();
        return users.find(u => u.USER_ID === userId);
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)()
], AuthRepository);
