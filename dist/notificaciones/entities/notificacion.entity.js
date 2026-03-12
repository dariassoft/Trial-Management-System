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
exports.Notificacion = exports.TipoNotificacion = void 0;
const typeorm_1 = require("typeorm");
const usuario_entity_1 = require("../../entities/usuario.entity");
var TipoNotificacion;
(function (TipoNotificacion) {
    TipoNotificacion["SIEMBRA"] = "siembra";
    TipoNotificacion["COSECHA"] = "cosecha";
    TipoNotificacion["MEDICION"] = "medicion";
    TipoNotificacion["INFO_INCOMPLETA"] = "info_incompleta";
    TipoNotificacion["RESUMEN_SEMANAL"] = "resumen_semanal";
    TipoNotificacion["GENERAL"] = "general";
})(TipoNotificacion || (exports.TipoNotificacion = TipoNotificacion = {}));
let Notificacion = class Notificacion {
};
exports.Notificacion = Notificacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notificacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", usuario_entity_1.Usuario)
], Notificacion.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Notificacion.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Notificacion.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Notificacion.prototype, "leido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, default: TipoNotificacion.GENERAL }),
    __metadata("design:type", String)
], Notificacion.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ensayo_id', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Notificacion.prototype, "ensayoId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Notificacion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Notificacion.prototype, "link", void 0);
exports.Notificacion = Notificacion = __decorate([
    (0, typeorm_1.Entity)('notificaciones')
], Notificacion);
