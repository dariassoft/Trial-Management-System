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
exports.UsuarioLaboratorio = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("./usuario.entity");
const laboratorio_entity_1 = require("./laboratorio.entity");
let UsuarioLaboratorio = class UsuarioLaboratorio {
};
exports.UsuarioLaboratorio = UsuarioLaboratorio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'usuario_lab_id' }),
    __metadata("design:type", Number)
], UsuarioLaboratorio.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, (u) => u.laboratoriosAsignados, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id_fk' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], UsuarioLaboratorio.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => laboratorio_entity_1.Laboratorio, (l) => l.usuariosAsignados, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'lab_id_fk' }),
    __metadata("design:type", laboratorio_entity_1.Laboratorio)
], UsuarioLaboratorio.prototype, "laboratorio", void 0);
exports.UsuarioLaboratorio = UsuarioLaboratorio = __decorate([
    (0, typeorm_1.Entity)('Usuario_Laboratorio'),
    (0, typeorm_1.Unique)(['usuario', 'laboratorio'])
], UsuarioLaboratorio);
