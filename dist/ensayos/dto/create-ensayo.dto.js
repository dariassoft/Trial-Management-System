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
exports.CreateEnsayoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEnsayoDto {
}
exports.CreateEnsayoDto = CreateEnsayoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del ensayo', example: 'Ensayo de Maíz Tardío 2025', type: String, maxLength: 255 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateEnsayoDto.prototype, "nombreEnsayo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Protocolo asociado', example: 1, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "protocoloId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Código/identificador asignado por el laboratorio', example: 'LAB-2025-003', type: String, maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "codigoLabor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Laboratorio asociado', example: 1, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "laboratorioId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Tipo de Ensayo (catálogo)', example: 4, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "tipoEnsayoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Usuario responsable del ensayo', example: 5, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "responsableId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provincia', example: 'Córdoba', type: String, maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "provincia", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Departamento', example: 'Río Cuarto', type: String, maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "departamento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Establecimiento', example: 'El Progreso', type: String, maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "establecimiento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lote', example: 'Lote 7A', type: String, maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "lote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitud en grados decimales', example: -33.1306, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "latitud", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitud en grados decimales', example: -64.349, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "longitud", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Cultivo (Especie)', example: 1, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "cultivoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de la Variedad del Cultivo', example: 1, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "variedadId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Tipo de Siembra', example: 1, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "tipoSiembraId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Distancia entre surcos (cm)', example: 52.5, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "distSurcosCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de Inicio (YYYY-MM-DD)', example: '2025-12-10', type: String, format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.fechaInicio !== null && o.fechaInicio !== ''),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de Siembra (YYYY-MM-DD)', example: '2025-12-15', type: String, format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "fechaSiembra", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de Cosecha (YYYY-MM-DD)', example: '2026-05-20', type: String, format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.fechaCosecha !== null && o.fechaCosecha !== ''),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "fechaCosecha", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Estado del ensayo', example: 1, type: Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEnsayoDto.prototype, "statusId", void 0);
