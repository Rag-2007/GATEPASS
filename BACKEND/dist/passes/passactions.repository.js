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
exports.PassActionsRepository = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
let PassActionsRepository = class PassActionsRepository {
    constructor() {
        this.filePath = path.join(process.cwd(), 'database', 'pass-actions.json');
    }
    async readActions() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            if (!data.trim()) {
                return [];
            }
            return JSON.parse(data);
        }
        catch (_a) {
            await fs.writeFile(this.filePath, "[]");
            return [];
        }
    }
    async writeActions(actions) {
        await fs.writeFile(this.filePath, JSON.stringify(actions, null, 2));
    }
    async createAction(passId, rollNo, ActorID, action) {
        const actions = await this.readActions();
        const newAction = {
            Action_id: "ACT-" + (0, uuid_1.v4)().slice(0, 8),
            Pass_id: passId,
            Actor_id: ActorID,
            Roll_NO: rollNo,
            Action_Type: action,
            Timestamp: new Date().toISOString()
        };
        actions.unshift(newAction);
        await this.writeActions(actions);
        return newAction;
    }
    async getAllActions() {
        return await this.readActions();
    }
};
exports.PassActionsRepository = PassActionsRepository;
exports.PassActionsRepository = PassActionsRepository = __decorate([
    (0, common_1.Injectable)()
], PassActionsRepository);
