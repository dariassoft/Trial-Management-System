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
exports.Ensayo = void 0;
const typeorm_1 = require("typeorm");
const aplicacion_entity_1 = require("./aplicacion.entity");
const bloque_entity_1 = require("./bloque.entity");
const parcela_entity_1 = require("./parcela.entity");
const laboratorio_entity_1 = require("./laboratorio.entity");
const tipo_ensayo_entity_1 = require("./tipo-ensayo.entity");
const protocolo_entity_1 = require("./protocolo.entity");
const usuario_entity_1 = require("./usuario.entity");
const cultivo_entity_1 = require("./cultivo.entity");
const cultivo_variedad_entity_1 = require("./cultivo-variedad.entity");
const tipo_siembra_entity_1 = require("./tipo-siembra.entity");
const status_ensayo_entity_1 = require("./status-ensayo.entity");
let Ensayo = class Ensayo {
};
exports.Ensayo = Ensayo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'ensayo_id' }),
    __metadata("design:type", Number)
], Ensayo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => laboratorio_entity_1.Laboratorio, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'lab_id_fk' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "laboratorio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codigo_labor', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "codigoLabor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_ensayo', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Ensayo.prototype, "nombreEnsayo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => protocolo_entity_1.Protocolo, (protocolo) => protocolo.ensayos, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'protocolo_id_fk' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "protocolo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_ensayo_entity_1.TipoEnsayo, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tipo_ensayo_id_fk' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "tipoEnsayo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => usuario_entity_1.Usuario, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'responsable_id' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "responsable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "provincia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "departamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "establecimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "lote", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "latitud", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "longitud", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cultivo_entity_1.Cultivo, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'cultivo_id' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "cultivo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cultivo_variedad_entity_1.CultivoVariedad, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'variedad_id' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "variedad", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_siembra_entity_1.TipoSiembra, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tipo_siembra_id' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "tipoSiembra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dist_surcos_cm', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "distSurcosCm", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'filas', type: 'int', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "filas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'columnas', type: 'int', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "columnas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_inicio', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_siembra', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "fechaSiembra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_cosecha', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], Ensayo.prototype, "fechaCosecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => status_ensayo_entity_1.StatusEnsayo, (status) => status.ensayos, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'status_id_fk' }),
    __metadata("design:type", Object)
], Ensayo.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => aplicacion_entity_1.Aplicacion, (aplicacion) => aplicacion.ensayo),
    __metadata("design:type", Array)
], Ensayo.prototype, "aplicaciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bloque_entity_1.Bloque, (bloque) => bloque.ensayo),
    __metadata("design:type", Array)
], Ensayo.prototype, "bloques", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => parcela_entity_1.Parcela, (parcela) => parcela.ensayo),
    __metadata("design:type", Array)
], Ensayo.prototype, "parcelas", void 0);
exports.Ensayo = Ensayo = __decorate([
    (0, typeorm_1.Entity)('Ensayo'),
    (0, typeorm_1.Unique)(['nombreEnsayo', 'protocolo']),
    (0, typeorm_1.Index)('uq_ensayo_lab_codigo', ['laboratorio', 'codigoLabor'], { unique: true })
], Ensayo);
