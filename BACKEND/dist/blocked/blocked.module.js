"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockedModule = void 0;
const common_1 = require("@nestjs/common");
const blocked_service_1 = require("./blocked.service");
const blocked_controller_1 = require("./blocked.controller");
const blocked_repository_1 = require("./blocked.repository");
const student_repository_1 = require("../student/student.repository");
let BlockedModule = class BlockedModule {
};
exports.BlockedModule = BlockedModule;
exports.BlockedModule = BlockedModule = __decorate([
    (0, common_1.Module)({
        controllers: [blocked_controller_1.BlockedController],
        providers: [blocked_service_1.BlockedService, blocked_repository_1.BlockedRepository, student_repository_1.StudentRepository],
        exports: [blocked_repository_1.BlockedRepository]
    })
], BlockedModule);
