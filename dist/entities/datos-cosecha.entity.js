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
exports.DatosCosecha = void 0;
const typeorm_1 = require("typeorm");
const parcela_entity_1 = require("./parcela.entity");
let DatosCosecha = class DatosCosecha {
};
exports.DatosCosecha = DatosCosecha;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'cosecha_id' }),
    __metadata("design:type", Number)
], DatosCosecha.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => parcela_entity_1.Parcela, (parcela) => parcela.cosecha, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'parcela_id_fk' }),
    __metadata("design:type", parcela_entity_1.Parcela)
], DatosCosecha.prototype, "parcela", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_cosecha', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "fechaCosecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'humedad_pct', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "humedadPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'kg_ha_corregido', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "kgHaCorregido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gie', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "gie", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gramaje_por_grano', type: 'decimal', precision: 8, scale: 6, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "gramajePorGrano", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'granos_porurf', type: 'decimal', precision: 10, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "granosPorurf", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'peso_granos_porurf', type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "pesoGranosPorUrf", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'granos_danados', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "granosDanados", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'granos_verdes', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "granosVerdes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'granos_vanos', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "granosVanos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hojas_porurf', type: 'decimal', precision: 10, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "hojasPorUrf", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'larvas_porurf', type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "larvasPorUrf", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'insectos_beneficios_porurf', type: 'decimal', precision: 8, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "insectosBeneficiosPorUrf", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'diametro_espiga', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "diametroEspiga", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'altura_parcela', type: 'decimal', precision: 5, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "alturaParcela", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'densidad_plantas_final', type: 'decimal', precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "densidadPlantasFinal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DatosCosecha.prototype, "observaciones", void 0);
exports.DatosCosecha = DatosCosecha = __decorate([
    (0, typeorm_1.Entity)('Datos_Cosecha')
], DatosCosecha);
