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
exports.Tratamiento = void 0;
const typeorm_1 = require("typeorm");
const protocolo_entity_1 = require("./protocolo.entity"); // Importar Protocolo
const parcela_entity_1 = require("./parcela.entity");
const tratamiento_producto_entity_1 = require("./tratamiento-producto.entity");
let Tratamiento = class Tratamiento {
};
exports.Tratamiento = Tratamiento;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tratamiento_id' }),
    __metadata("design:type", Number)
], Tratamiento.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => protocolo_entity_1.Protocolo, (protocolo) => protocolo.tratamientos, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'protocolo_id_fk' }) // Nueva FK
    ,
    __metadata("design:type", protocolo_entity_1.Protocolo)
], Tratamiento.prototype, "protocolo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_trat', type: 'int' }),
    __metadata("design:type", Number)
], Tratamiento.prototype, "numeroTrat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Tratamiento.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'es_testigo', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Tratamiento.prototype, "esTestigo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parcela_entity_1.Parcela, (parcela) => parcela.tratamiento),
    __metadata("design:type", Array)
], Tratamiento.prototype, "parcelas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tratamiento_producto_entity_1.TratamientoProducto, (tp) => tp.tratamiento),
    __metadata("design:type", Array)
], Tratamiento.prototype, "productos", void 0);
exports.Tratamiento = Tratamiento = __decorate([
    (0, typeorm_1.Entity)('Tratamiento'),
    (0, typeorm_1.Unique)(['protocolo', 'numeroTrat']) // Restaurado
], Tratamiento);
