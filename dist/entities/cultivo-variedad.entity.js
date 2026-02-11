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
exports.CultivoVariedad = void 0;
const typeorm_1 = require("typeorm");
const cultivo_entity_1 = require("./cultivo.entity");
let CultivoVariedad = class CultivoVariedad {
};
exports.CultivoVariedad = CultivoVariedad;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'variedad_id' }),
    __metadata("design:type", Number)
], CultivoVariedad.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], CultivoVariedad.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CultivoVariedad.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], CultivoVariedad.prototype, "caracteristicas", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], CultivoVariedad.prototype, "esta_activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CultivoVariedad.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], CultivoVariedad.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cultivo_entity_1.Cultivo, (cultivo) => cultivo.variedades, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'cultivo_id_fk' }),
    __metadata("design:type", cultivo_entity_1.Cultivo)
], CultivoVariedad.prototype, "cultivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cultivo_id_fk' }),
    __metadata("design:type", Number)
], CultivoVariedad.prototype, "cultivo_id", void 0);
exports.CultivoVariedad = CultivoVariedad = __decorate([
    (0, typeorm_1.Entity)('Cultivo_Variedad')
], CultivoVariedad);
