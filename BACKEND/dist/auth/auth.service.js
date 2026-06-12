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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_helper_1 = require("./helper/jwt.helper");
const auth_repository_1 = require("./auth.repository");
const node_crypto_1 = require("node:crypto");
const util_1 = require("util");
const scrypt = (0, util_1.promisify)(node_crypto_1.scrypt);
let AuthService = class AuthService {
    constructor(authrepo) {
        this.authrepo = authrepo;
    }
    async signup(body) {
        const existing = await this.authrepo.findUserByEmail(body.Email);
        if (existing) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const salt = (0, node_crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(body.password, salt, 32));
        const storedPassword = hash.toString('hex') + '*' + salt;
        const uid = await this.authrepo.createUser({
            Name: body.Name,
            Email: body.Email,
            PhoneNo: body.PhoneNo,
            Role: body.role,
            Password_Hash: storedPassword,
            RefreshToken: null,
        });
        return { UserID: uid, message: 'User created successfully' };
    }
    async updateUser(userId, data) {
        const salt = (0, node_crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(data.Password, salt, 32));
        const storedPassword = hash.toString('hex') + '*' + salt;
        await this.authrepo.updateUser(userId, {
            Name: data.Name,
            Email: data.Email,
            PhoneNo: data.PhoneNo,
            Password_Hash: storedPassword,
        });
    }
    async ValidateandGenerateTokens(body) {
        let email = body.Email;
        let pass = body.password;
        let role = body.role;
        const storedHash = await this.authrepo.findOne(email, role);
        if (!storedHash) {
            throw new common_1.NotFoundException('User not found');
        }
        const [pass_stored, salt] = storedHash.split('*');
        const newHash = (await scrypt(pass, salt, 32));
        if (newHash.toString('hex') !== pass_stored) {
            throw new common_1.BadRequestException('Wrong password');
        }
        const accessToken = (0, jwt_helper_1.signAccessToken)({ email, role });
        const refreshToken = (0, jwt_helper_1.signRefreshToken)({ email, role });
        const UserID = await this.authrepo.findUID(email);
        return { accessToken, refreshToken, UserID };
    }
    async setRefreshToken(UserID, refreshtoken) {
        const salt = (0, node_crypto_1.randomBytes)(8).toString('hex');
        const hash = (await scrypt(refreshtoken, salt, 32));
        const store = hash.toString('hex') + '*' + salt;
        await this.authrepo.setRefreshToken(UserID, store);
    }
    async deleteRefreshToken(UserID) {
        console.log(UserID);
        await this.authrepo.deleteToken(UserID);
    }
    async RotateTokens(body) {
        let userid = body.userId;
        let reftok = body.refreshToken;
        try {
            (0, jwt_helper_1.verifyRefreshToken)(reftok);
        }
        catch (_a) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const storedToken = await this.authrepo.getRefreshToken(userid);
        if (!storedToken) {
            throw new common_1.UnauthorizedException('No refresh token found');
        }
        const [storedHash, salt] = storedToken.split('*');
        const newHash = (await scrypt(reftok, salt, 32));
        if (newHash.toString('hex') !== storedHash) {
            throw new common_1.UnauthorizedException('Refresh token mismatch');
        }
        let email = await this.authrepo.findEmail(userid);
        let role = await this.authrepo.findRole(userid);
        const accessToken = (0, jwt_helper_1.signAccessToken)({ email, role });
        const refreshToken = (0, jwt_helper_1.signRefreshToken)({ email, role });
        return { accessToken, refreshToken, userid };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository])
], AuthService);
