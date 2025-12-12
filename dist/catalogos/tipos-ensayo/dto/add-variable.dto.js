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
exports.AddVariableDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddVariableDto {
}
exports.AddVariableDto = AddVariableDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la variable del diccionario (Protocolo_Variable)', example: 12 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], AddVariableDto.prototype, "variableId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Orden de visualización', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddVariableDto.prototype, "orden", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Si la variable es requerida', default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AddVariableDto.prototype, "requerido", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Unidad a mostrar (override)', example: 'N°/METRO', maxLength: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", Object)
], AddVariableDto.prototype, "unidadOverride", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Escala (ej. 1-9, 0-100)', example: '1-9', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], AddVariableDto.prototype, "escala", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rango mínimo permitido (numérico)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], AddVariableDto.prototype, "rangoMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Rango máximo permitido (numérico)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], AddVariableDto.prototype, "rangoMax", void 0);
