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
exports.UpdateEnsayoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// Helper DTOs to validate nested objects with an 'id' property
class RelationIdDto {
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], RelationIdDto.prototype, "id", void 0);
class UpdateEnsayoDto {
}
exports.UpdateEnsayoDto = UpdateEnsayoDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del ensayo (se ignora, se usa el de la URL)', example: 71 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateEnsayoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nombre del ensayo', example: 'Ensayo de Girasol 2025 (Corregido)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], UpdateEnsayoDto.prototype, "nombreEnsayo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Protocolo asociado', example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "protocoloId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => RelationIdDto, description: 'Objeto Protocolo con ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RelationIdDto),
    __metadata("design:type", RelationIdDto)
], UpdateEnsayoDto.prototype, "protocolo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Código/identificador asignado por el laboratorio', example: 'LAB-2025-004-MOD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "codigoLabor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Laboratorio asociado', example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "laboratorioId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => RelationIdDto, description: 'Objeto Laboratorio con ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RelationIdDto),
    __metadata("design:type", RelationIdDto)
], UpdateEnsayoDto.prototype, "laboratorio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Tipo de Ensayo (catálogo)', example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "tipoEnsayoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => RelationIdDto, description: 'Objeto TipoEnsayo con ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RelationIdDto),
    __metadata("design:type", RelationIdDto)
], UpdateEnsayoDto.prototype, "tipoEnsayo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Usuario responsable del ensayo', example: 6 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "responsableId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => RelationIdDto, description: 'Objeto Responsable con ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RelationIdDto),
    __metadata("design:type", RelationIdDto)
], UpdateEnsayoDto.prototype, "responsable", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Provincia', example: 'Santa Fe' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "provincia", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Departamento', example: 'General López' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "departamento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Establecimiento', example: 'La Perseverancia' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "establecimiento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Lote', example: 'Lote 12B' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "lote", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Latitud en grados decimales', example: -33.754 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "latitud", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Longitud en grados decimales', example: -61.96 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "longitud", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Cultivo (Especie)', example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "cultivoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => RelationIdDto, description: 'Objeto Cultivo con ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RelationIdDto),
    __metadata("design:type", RelationIdDto)
], UpdateEnsayoDto.prototype, "cultivo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de la Variedad del Cultivo', example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "variedadId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => RelationIdDto, description: 'Objeto Variedad con ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RelationIdDto),
    __metadata("design:type", RelationIdDto)
], UpdateEnsayoDto.prototype, "variedad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Tipo de Siembra', example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "tipoSiembraId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => RelationIdDto, description: 'Objeto TipoSiembra con ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RelationIdDto),
    __metadata("design:type", RelationIdDto)
], UpdateEnsayoDto.prototype, "tipoSiembra", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Distancia entre surcos (cm)', example: 70 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "distSurcosCm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Número de filas en la matriz de parcelas (define estructura NxM)', example: 3, type: Number, minimum: 1, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.filas !== null && o.filas !== undefined && o.filas !== ''),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "filas", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Número de columnas en la matriz de parcelas (define estructura NxM)', example: 4, type: Number, minimum: 1, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.columnas !== null && o.columnas !== undefined && o.columnas !== ''),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "columnas", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cantidad de bloques a crear', example: 3, type: Number, minimum: 1, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.cantBloques !== null && o.cantBloques !== undefined && o.cantBloques !== ''),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "cantBloques", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de Inicio (YYYY-MM-DD)', example: '2025-10-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.fechaInicio !== null && o.fechaInicio !== ''),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de Siembra (YYYY-MM-DD)', example: '2025-10-20' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "fechaSiembra", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de Cosecha (YYYY-MM-DD)', example: '2025-12-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)(o => o.fechaCosecha !== null && o.fechaCosecha !== ''),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "fechaCosecha", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del Estado del ensayo', example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], UpdateEnsayoDto.prototype, "statusId", void 0);
