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
exports.CreateNotificacionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const notificacion_entity_1 = require("../entities/notificacion.entity");
class CreateNotificacionDto {
}
exports.CreateNotificacionDto = CreateNotificacionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del usuario destinatario' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNotificacionDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título de la notificación' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificacionDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción detallada' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificacionDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Link de navegación' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificacionDto.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: notificacion_entity_1.TipoNotificacion, description: 'Tipo de notificación' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notificacion_entity_1.TipoNotificacion),
    __metadata("design:type", String)
], CreateNotificacionDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del ensayo relacionado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateNotificacionDto.prototype, "ensayoId", void 0);
