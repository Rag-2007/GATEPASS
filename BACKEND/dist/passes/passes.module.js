"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassesModule = void 0;
const common_1 = require("@nestjs/common");
const passes_service_1 = require("./passes.service");
const passes_controller_1 = require("./passes.controller");
const passes_repository_1 = require("./passes.repository");
const blocked_module_1 = require("../blocked/blocked.module");
const passactions_repository_1 = require("./passactions.repository");
const auth_repository_1 = require("../auth/auth.repository");
const student_repository_1 = require("../student/student.repository");
let PassesModule = class PassesModule {
};
exports.PassesModule = PassesModule;
exports.PassesModule = PassesModule = __decorate([
    (0, common_1.Module)({
        imports: [blocked_module_1.BlockedModule],
        controllers: [passes_controller_1.PassesController],
        providers: [passes_service_1.PassesService, passes_repository_1.PassesRepository, passactions_repository_1.PassActionsRepository, auth_repository_1.AuthRepository, student_repository_1.StudentRepository],
    })
], PassesModule);
