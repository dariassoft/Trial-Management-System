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
exports.CreateAplicacionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAplicacionDto {
}
exports.CreateAplicacionDto = CreateAplicacionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del ensayo al que pertenece la aplicación' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateAplicacionDto.prototype, "ensayoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Primera aplicación', maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAplicacionDto.prototype, "nombreAplicacion", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-03-18T10:30:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAplicacionDto.prototype, "fechaHora", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'V6', maxLength: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateAplicacionDto.prototype, "estadioCultivo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 25.5, description: 'Temperatura (°C)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateAplicacionDto.prototype, "tempC", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 60.0, description: 'Humedad relativa (%)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateAplicacionDto.prototype, "humedadPct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12.3, description: 'Viento (km/h)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateAplicacionDto.prototype, "vientoKmh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pulverizadora Jacto', maxLength: 255 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", Object)
], CreateAplicacionDto.prototype, "equipoInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pico XR11002', maxLength: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", Object)
], CreateAplicacionDto.prototype, "picoInfo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2.5, description: 'Presión (bar)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateAplicacionDto.prototype, "presionBar", void 0);
