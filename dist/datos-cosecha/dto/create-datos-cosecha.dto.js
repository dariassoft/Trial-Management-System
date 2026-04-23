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
exports.CreateDatosCosechaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDatosCosechaDto {
}
exports.CreateDatosCosechaDto = CreateDatosCosechaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la parcela' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateDatosCosechaDto.prototype, "parcelaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-05-30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "fechaCosecha", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 14.2, description: 'Humedad (%)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "humedadPct", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5200.5, description: 'kg/ha corregido' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "kgHaCorregido", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 123.45 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "gie", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0.045, description: 'Peso individual del grano (g)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "gramajePorGrano", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 48500, description: 'Cantidad de granos por m²' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "granosPorurf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2182.5, description: 'Peso total de granos por m² (g)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "pesoGranosPorUrf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4.2, description: '% de granos dañados' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "granosDanados", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2.1, description: '% de granos verdes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "granosVerdes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1.8, description: '% de granos vanos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "granosVanos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 4850, description: 'Hojas por m²' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "hojasPorUrf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 12, description: 'Larvas por m²' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "larvasPorUrf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 28, description: 'Insectos benéficos por m²' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "insectosBeneficiosPorUrf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 8.5, description: 'Diámetro de espiga (mm)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "diametroEspiga", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 75.5, description: 'Altura de la parcela (cm)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "alturaParcela", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 8.2, description: 'Densidad final de plantas (plantas/m²)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "densidadPlantasFinal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Observaciones de la trilla', maxLength: 65535 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(65535),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "observaciones", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 15200.5, description: 'Peso total del grano cosechado por parcela en gramos' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "pesoGranoCosechado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 14.2, description: 'Humedad del grano al momento de cosecha (%)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "humedadGranoCosechado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30.0, description: 'Superficie cosechada en m² (para extrapolación a kg/ha)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], CreateDatosCosechaDto.prototype, "superficieCosechadaM2", void 0);
