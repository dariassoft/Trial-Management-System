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
exports.Parcela = void 0;
const typeorm_1 = require("typeorm");
const ensayo_entity_1 = require("./ensayo.entity");
const bloque_entity_1 = require("./bloque.entity");
const tratamiento_entity_1 = require("./tratamiento.entity");
const datos_campo_entity_1 = require("./datos-campo.entity");
const datos_cosecha_entity_1 = require("./datos-cosecha.entity");
let Parcela = class Parcela {
};
exports.Parcela = Parcela;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'parcela_id' }),
    __metadata("design:type", Number)
], Parcela.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ensayo_entity_1.Ensayo, (ensayo) => ensayo.parcelas, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ensayo_id_fk' }),
    __metadata("design:type", ensayo_entity_1.Ensayo)
], Parcela.prototype, "ensayo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bloque_entity_1.Bloque, (bloque) => bloque.parcelas, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bloque_id_fk' }),
    __metadata("design:type", bloque_entity_1.Bloque)
], Parcela.prototype, "bloque", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tratamiento_entity_1.Tratamiento, (tratamiento) => tratamiento.parcelas, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tratamiento_id_fk' }),
    __metadata("design:type", tratamiento_entity_1.Tratamiento)
], Parcela.prototype, "tratamiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_parcela', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Parcela.prototype, "nombreParcela", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pos_x_grid', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Parcela.prototype, "posXGrid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pos_y_grid', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Parcela.prototype, "posYGrid", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => datos_campo_entity_1.DatosCampo, (dc) => dc.parcela),
    __metadata("design:type", Array)
], Parcela.prototype, "datosCampo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => datos_cosecha_entity_1.DatosCosecha, (cosecha) => cosecha.parcela),
    __metadata("design:type", Object)
], Parcela.prototype, "cosecha", void 0);
exports.Parcela = Parcela = __decorate([
    (0, typeorm_1.Entity)('Parcela')
    // Eliminado: @Unique(['bloque', 'tratamiento']) - Un tratamiento puede repetirse en diferentes parcelas del mismo bloque
    ,
    (0, typeorm_1.Unique)('uq_parcela_ensayo_nombre', ['ensayo', 'nombreParcela']),
    (0, typeorm_1.Index)('idx_parcela_nombre', ['nombreParcela'])
], Parcela);
