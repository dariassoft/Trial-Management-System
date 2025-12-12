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
exports.Producto = void 0;
const typeorm_1 = require("typeorm");
const laboratorio_entity_1 = require("./laboratorio.entity");
const tratamiento_producto_entity_1 = require("./tratamiento-producto.entity");
let Producto = class Producto {
};
exports.Producto = Producto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'producto_id' }),
    __metadata("design:type", Number)
], Producto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => laboratorio_entity_1.Laboratorio, (laboratorio) => laboratorio.productos, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'lab_id_fk' }),
    __metadata("design:type", Object)
], Producto.prototype, "laboratorio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Producto.prototype, "nombre_comercial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Producto.prototype, "principio_activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Producto.prototype, "formulacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tratamiento_producto_entity_1.TratamientoProducto, (tp) => tp.producto),
    __metadata("design:type", Array)
], Producto.prototype, "tratamientosProducto", void 0);
exports.Producto = Producto = __decorate([
    (0, typeorm_1.Entity)('Producto')
], Producto);
