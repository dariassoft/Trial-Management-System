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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("./create-user.dto");
const swagger_2 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
// Extend but explicitly omit username and laboratorioIds from updates via documentation/validation guidance
class UpdateUserDto extends (0, swagger_1.PartialType)(create_user_dto_1.CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Nueva contraseña (opcional). Si se envía, se vuelve a hashear.', minLength: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'ID del rol (opcional)', example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "rolId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Nombre', example: 'Juan', maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Apellido', example: 'García', maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "apellido", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Teléfono', example: '3875000000', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Fecha de nacimiento (YYYY-MM-DD)', example: '1992-01-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], UpdateUserDto.prototype, "fecha_nacimiento", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Usuario activo', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "esta_activo", void 0);
