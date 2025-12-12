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
exports.TratamientoProducto = void 0;
const typeorm_1 = require("typeorm");
const tratamiento_entity_1 = require("./tratamiento.entity");
const producto_entity_1 = require("./producto.entity");
let TratamientoProducto = class TratamientoProducto {
};
exports.TratamientoProducto = TratamientoProducto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'trat_prod_id' }),
    __metadata("design:type", Number)
], TratamientoProducto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tratamiento_entity_1.Tratamiento, (tratamiento) => tratamiento.productos, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tratamiento_id_fk' }),
    __metadata("design:type", tratamiento_entity_1.Tratamiento)
], TratamientoProducto.prototype, "tratamiento", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto, (producto) => producto.tratamientosProducto, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'producto_id_fk' }),
    __metadata("design:type", producto_entity_1.Producto)
], TratamientoProducto.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], TratamientoProducto.prototype, "dosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unidad_dosis', type: 'varchar', length: 20, default: 'cc/ha' }),
    __metadata("design:type", String)
], TratamientoProducto.prototype, "unidadDosis", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, comment: 'Estadio de aplicación (V2, V3, V4, etc.)' }),
    __metadata("design:type", Object)
], TratamientoProducto.prototype, "estadio", void 0);
exports.TratamientoProducto = TratamientoProducto = __decorate([
    (0, typeorm_1.Entity)('Tratamiento_Producto'),
    (0, typeorm_1.Unique)(['tratamiento', 'producto'])
], TratamientoProducto);
