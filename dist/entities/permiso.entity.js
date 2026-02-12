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
exports.Permiso = exports.AccionPermiso = void 0;
const typeorm_1 = require("typeorm");
const rol_entity_1 = require("./rol.entity");
var AccionPermiso;
(function (AccionPermiso) {
    AccionPermiso["VER"] = "VER";
    AccionPermiso["CREAR"] = "CREAR";
    AccionPermiso["EDITAR"] = "EDITAR";
    AccionPermiso["ELIMINAR"] = "ELIMINAR";
    AccionPermiso["LISTAR"] = "LISTAR";
    AccionPermiso["EXPORTAR"] = "EXPORTAR";
})(AccionPermiso || (exports.AccionPermiso = AccionPermiso = {}));
let Permiso = class Permiso {
};
exports.Permiso = Permiso;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'permiso_id' }),
    __metadata("design:type", Number)
], Permiso.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => rol_entity_1.Rol, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'rol_id_fk' }),
    __metadata("design:type", rol_entity_1.Rol)
], Permiso.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rol_id_fk' }),
    __metadata("design:type", Number)
], Permiso.prototype, "rol_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: false }),
    __metadata("design:type", String)
], Permiso.prototype, "recurso", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], Permiso.prototype, "accion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Permiso.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Permiso.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Permiso.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Permiso.prototype, "updatedAt", void 0);
exports.Permiso = Permiso = __decorate([
    (0, typeorm_1.Entity)('Permiso')
], Permiso);
