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
exports.CreateParcelaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateParcelaDto {
}
exports.CreateParcelaDto = CreateParcelaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del ensayo' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateParcelaDto.prototype, "ensayoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del bloque' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateParcelaDto.prototype, "bloqueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del tratamiento' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateParcelaDto.prototype, "tratamientoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre/código manual de la parcela (único dentro del ensayo)', example: '26-BASF-0001-PRE-1 A', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateParcelaDto.prototype, "nombreParcela", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Posición X en grilla (opcional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateParcelaDto.prototype, "posXGrid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2, description: 'Posición Y en grilla (opcional)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateParcelaDto.prototype, "posYGrid", void 0);
