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
exports.PrerequisitosResponseDto = exports.PrerequisitoPasoDto = exports.EstadoFlujoResponseDto = exports.ProgresoFlujoDto = exports.PasoFlujoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
/** Representa un paso individual del flujo de trabajo */
class PasoFlujoDto {
}
exports.PasoFlujoDto = PasoFlujoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identificador único del paso', example: 'laboratorio' }),
    __metadata("design:type", String)
], PasoFlujoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de orden del paso', example: 1 }),
    __metadata("design:type", Number)
], PasoFlujoDto.prototype, "orden", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre legible del paso', example: 'Laboratorio' }),
    __metadata("design:type", String)
], PasoFlujoDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción breve del paso' }),
    __metadata("design:type", String)
], PasoFlujoDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '¿El paso está completado?', example: true }),
    __metadata("design:type", Boolean)
], PasoFlujoDto.prototype, "completado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detalle extra del estado' }),
    __metadata("design:type", String)
], PasoFlujoDto.prototype, "detalle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Progreso parcial (ej: "3/10 parcelas")' }),
    __metadata("design:type", String)
], PasoFlujoDto.prototype, "progreso", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ruta en el frontend para completar este paso', example: '/admin/laboratorios' }),
    __metadata("design:type", String)
], PasoFlujoDto.prototype, "ruta", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Ícono sugerido para el paso' }),
    __metadata("design:type", String)
], PasoFlujoDto.prototype, "icono", void 0);
/** Resumen de progreso general */
class ProgresoFlujoDto {
}
exports.ProgresoFlujoDto = ProgresoFlujoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], ProgresoFlujoDto.prototype, "completados", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], ProgresoFlujoDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], ProgresoFlujoDto.prototype, "porcentaje", void 0);
/** Respuesta completa del estado de flujo de un ensayo */
class EstadoFlujoResponseDto {
}
exports.EstadoFlujoResponseDto = EstadoFlujoResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42 }),
    __metadata("design:type", Number)
], EstadoFlujoResponseDto.prototype, "ensayoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ensayo Soja Norte 2026' }),
    __metadata("design:type", String)
], EstadoFlujoResponseDto.prototype, "nombreEnsayo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PasoFlujoDto] }),
    __metadata("design:type", Array)
], EstadoFlujoResponseDto.prototype, "pasos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: PasoFlujoDto, description: 'Próximo paso a completar' }),
    __metadata("design:type", Object)
], EstadoFlujoResponseDto.prototype, "siguientePaso", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ProgresoFlujoDto }),
    __metadata("design:type", ProgresoFlujoDto)
], EstadoFlujoResponseDto.prototype, "progreso", void 0);
/** Estado de un prerequisito global */
class PrerequisitoPasoDto {
}
exports.PrerequisitoPasoDto = PrerequisitoPasoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'laboratorios' }),
    __metadata("design:type", String)
], PrerequisitoPasoDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Laboratorios' }),
    __metadata("design:type", String)
], PrerequisitoPasoDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], PrerequisitoPasoDto.prototype, "disponible", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], PrerequisitoPasoDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Detalle adicional' }),
    __metadata("design:type", String)
], PrerequisitoPasoDto.prototype, "detalle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Ruta para crear/gestionar', example: '/admin/laboratorios' }),
    __metadata("design:type", String)
], PrerequisitoPasoDto.prototype, "ruta", void 0);
/** Respuesta de prerequisitos globales (antes de crear un ensayo) */
class PrerequisitosResponseDto {
}
exports.PrerequisitosResponseDto = PrerequisitosResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '¿Están todos los prerequisitos mínimos cumplidos?' }),
    __metadata("design:type", Boolean)
], PrerequisitosResponseDto.prototype, "puedeCrearEnsayo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PrerequisitoPasoDto] }),
    __metadata("design:type", Array)
], PrerequisitosResponseDto.prototype, "prerequisitos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mensaje resumen' }),
    __metadata("design:type", String)
], PrerequisitosResponseDto.prototype, "mensaje", void 0);
