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
exports.CreateDatosCampoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
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
class CreateDatosCampoDto {
}
exports.CreateDatosCampoDto = CreateDatosCampoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la Parcela', example: 12 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDatosCampoDto.prototype, "parcela_id_fk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del Momento de Evaluación', example: 3 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDatosCampoDto.prototype, "momento_id_fk", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Observaciones generales de la visita' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(65535),
    __metadata("design:type", String)
], CreateDatosCampoDto.prototype, "observaciones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MedicionDto], description: 'Lista de mediciones tomadas' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MedicionDto),
    __metadata("design:type", Array)
], CreateDatosCampoDto.prototype, "mediciones", void 0);
