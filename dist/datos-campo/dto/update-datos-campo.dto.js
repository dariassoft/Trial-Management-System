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
exports.UpdateDatosCampoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
// DTO anidado para una sola medición (reemplaza las existentes)
class MedicionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la variable a medir', example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], MedicionDto.prototype, "variable_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor registrado', example: '10.5' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MedicionDto.prototype, "valor", void 0);
class UpdateDatosCampoDto {
}
exports.UpdateDatosCampoDto = UpdateDatosCampoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Observaciones generales de la visita', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDatosCampoDto.prototype, "observaciones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [MedicionDto],
        required: false,
        description: 'Lista COMPLETA de mediciones. Reemplazará las existentes si se envía.'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MedicionDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateDatosCampoDto.prototype, "mediciones", void 0);
