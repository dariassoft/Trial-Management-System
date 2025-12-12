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
exports.Aplicacion = void 0;
const typeorm_1 = require("typeorm");
const ensayo_entity_1 = require("./ensayo.entity");
const momento_evaluacion_entity_1 = require("./momento-evaluacion.entity");
let Aplicacion = class Aplicacion {
};
exports.Aplicacion = Aplicacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'aplicacion_id' }),
    __metadata("design:type", Number)
], Aplicacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ensayo_entity_1.Ensayo, (ensayo) => ensayo.aplicaciones, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ensayo_id_fk' }),
    __metadata("design:type", ensayo_entity_1.Ensayo)
], Aplicacion.prototype, "ensayo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_aplicacion', type: 'varchar', length: 100, default: 'Primera aplicación' }),
    __metadata("design:type", String)
], Aplicacion.prototype, "nombreAplicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_hora', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "fechaHora", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estadio_cultivo', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "estadioCultivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'temp_c', type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "tempC", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'humedad_pct', type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "humedadPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'viento_kmh', type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "vientoKmh", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'equipo_info', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "equipoInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pico_info', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "picoInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'presion_bar', type: 'decimal', precision: 4, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Aplicacion.prototype, "presionBar", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => momento_evaluacion_entity_1.MomentoEvaluacion, (momento) => momento.aplicacion),
    __metadata("design:type", Array)
], Aplicacion.prototype, "momentos", void 0);
exports.Aplicacion = Aplicacion = __decorate([
    (0, typeorm_1.Entity)('Aplicacion')
], Aplicacion);
