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
exports.CreateTratamientoProductoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTratamientoProductoDto {
}
exports.CreateTratamientoProductoDto = CreateTratamientoProductoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del tratamiento' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTratamientoProductoDto.prototype, "tratamientoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'ID del producto' }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateTratamientoProductoDto.prototype, "productoId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '800',
        description: 'Dosis aplicada (ej: 800, 500+300, 1500)',
        maxLength: 50,
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", Object)
], CreateTratamientoProductoDto.prototype, "dosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'cc/ha',
        description: 'Unidad de dosis (ej: cc/ha, ml, l, g, kg, gr/ha)',
        maxLength: 20,
        type: String,
        default: 'cc/ha'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", Object)
], CreateTratamientoProductoDto.prototype, "unidadDosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'V4',
        description: 'Estadio de aplicación - Válores: V2, V3, V4, V5, V6, V7, V8, R1, R2, R3, etc. (ej: V4, V3, sin especificar)',
        maxLength: 20,
        type: String
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", Object)
], CreateTratamientoProductoDto.prototype, "estadio", void 0);
