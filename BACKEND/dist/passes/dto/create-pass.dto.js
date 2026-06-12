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
exports.CreatePassDto = void 0;
const class_validator_1 = require("class-validator");
var Pass_Type;
(function (Pass_Type) {
    Pass_Type["DAY_PASS"] = "DAY_PASS";
    Pass_Type["HOME_PASS"] = "HOME_PASS";
})(Pass_Type || (Pass_Type = {}));
class CreatePassDto {
}
exports.CreatePassDto = CreatePassDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(Pass_Type),
    __metadata("design:type", String)
], CreatePassDto.prototype, "passtype", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePassDto.prototype, "destination", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePassDto.prototype, "purpose", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePassDto.prototype, "modeOfTransport", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePassDto.prototype, "expectedDate", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^([01]\d|2[0-3]):([0-5]\d)$/),
    __metadata("design:type", String)
], CreatePassDto.prototype, "expectedTime", void 0);
// {
//    "passtype": "HOME_PASS",
//    "destination": "Hyderabad",
//    "purpose": "Festival Vacation",
//    "modeOfTransport": "Bus",
//    "Status": "CHECKEDIN",
//    "expectedDate": "2026-06-15",
//    "expectedTime": "18:30"
// }
