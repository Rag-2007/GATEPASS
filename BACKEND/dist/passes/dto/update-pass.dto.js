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
exports.UpdatePassDto = exports.PassStatus = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pass_dto_1 = require("./create-pass.dto");
const class_validator_1 = require("class-validator");
var PassStatus;
(function (PassStatus) {
    PassStatus["PENDING"] = "PENDING";
    PassStatus["CANCELLED"] = "CANCELLED";
    PassStatus["Parentapproved"] = "Parentapproved";
    PassStatus["CareTakerapproved"] = "CareTakerapproved";
    PassStatus["CHECKEDIN"] = "CHECKEDIN";
    PassStatus["CHECKEDOUT"] = "CHECKEDOUT";
})(PassStatus || (exports.PassStatus = PassStatus = {}));
class UpdatePassDto extends (0, mapped_types_1.PartialType)(create_pass_dto_1.CreatePassDto) {
}
exports.UpdatePassDto = UpdatePassDto;
__decorate([
    (0, class_validator_1.IsEnum)(PassStatus),
    __metadata("design:type", String)
], UpdatePassDto.prototype, "Status", void 0);
