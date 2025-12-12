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
exports.Laboratorio = void 0;
const typeorm_1 = require("typeorm");
const producto_entity_1 = require("./producto.entity");
const usuario_laboratorio_entity_1 = require("./usuario-laboratorio.entity");
let Laboratorio = class Laboratorio {
};
exports.Laboratorio = Laboratorio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'lab_id' }),
    __metadata("design:type", Number)
], Laboratorio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Laboratorio.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => producto_entity_1.Producto, (producto) => producto.laboratorio),
    __metadata("design:type", Array)
], Laboratorio.prototype, "productos", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => usuario_laboratorio_entity_1.UsuarioLaboratorio, (ul) => ul.laboratorio),
    __metadata("design:type", Array)
], Laboratorio.prototype, "usuariosAsignados", void 0);
exports.Laboratorio = Laboratorio = __decorate([
    (0, typeorm_1.Entity)('Laboratorio')
], Laboratorio);
