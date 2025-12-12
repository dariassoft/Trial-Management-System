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
exports.CreateMomentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMomentoDto {
}
exports.CreateMomentoDto = CreateMomentoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la aplicación a la que pertenece' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateMomentoDto.prototype, "aplicacionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '7DDA', maxLength: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateMomentoDto.prototype, "nombreMomento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 7 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateMomentoDto.prototype, "diasDespuesAplicacion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-04-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateMomentoDto.prototype, "fechaEvaluacion", void 0);
