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
exports.CreatePermisoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const permiso_entity_1 = require("../../entities/permiso.entity");
class CreatePermisoDto {
}
exports.CreatePermisoDto = CreatePermisoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del rol al que pertenece este permiso',
        example: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreatePermisoDto.prototype, "rol_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Recurso/módulo (ej: laboratorios, usuarios, productos)',
        example: 'laboratorios',
        maxLength: 100,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePermisoDto.prototype, "recurso", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Acción permitida',
        example: 'VER',
        enum: permiso_entity_1.AccionPermiso,
    }),
    (0, class_validator_1.IsEnum)(permiso_entity_1.AccionPermiso),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePermisoDto.prototype, "accion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Descripción del permiso',
        example: 'Permite ver todos los laboratorios',
        maxLength: 500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", Object)
], CreatePermisoDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Permiso activo',
        example: true,
        default: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePermisoDto.prototype, "activo", void 0);
