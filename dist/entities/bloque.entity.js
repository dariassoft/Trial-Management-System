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
exports.Bloque = void 0;
const typeorm_1 = require("typeorm");
const ensayo_entity_1 = require("./ensayo.entity");
const parcela_entity_1 = require("./parcela.entity");
let Bloque = class Bloque {
};
exports.Bloque = Bloque;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'bloque_id' }),
    __metadata("design:type", Number)
], Bloque.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ensayo_entity_1.Ensayo, (ensayo) => ensayo.bloques, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ensayo_id_fk' }),
    __metadata("design:type", ensayo_entity_1.Ensayo)
], Bloque.prototype, "ensayo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_bloque', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Bloque.prototype, "nombreBloque", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parcela_entity_1.Parcela, (parcela) => parcela.bloque),
    __metadata("design:type", Array)
], Bloque.prototype, "parcelas", void 0);
exports.Bloque = Bloque = __decorate([
    (0, typeorm_1.Entity)('Bloque'),
    (0, typeorm_1.Unique)(['ensayo', 'nombreBloque'])
], Bloque);
