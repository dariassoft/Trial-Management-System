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
exports.DatosSiembra = void 0;
const typeorm_1 = require("typeorm");
const parcela_entity_1 = require("./parcela.entity");
let DatosSiembra = class DatosSiembra {
};
exports.DatosSiembra = DatosSiembra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'siembra_id' }),
    __metadata("design:type", Number)
], DatosSiembra.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => parcela_entity_1.Parcela, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'parcela_id_fk' }),
    __metadata("design:type", parcela_entity_1.Parcela)
], DatosSiembra.prototype, "parcela", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_siembra', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], DatosSiembra.prototype, "fechaSiembra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'semillas_por_metro', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosSiembra.prototype, "semillasPorMetro", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'densidad_siembra', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosSiembra.prototype, "densidadSiembra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'germinacion_pct', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], DatosSiembra.prototype, "germinacionPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vigor_plantas_escala', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], DatosSiembra.prototype, "vigorPlantasEscala", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DatosSiembra.prototype, "observaciones", void 0);
exports.DatosSiembra = DatosSiembra = __decorate([
    (0, typeorm_1.Entity)('Datos_Siembra')
], DatosSiembra);
