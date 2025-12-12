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
exports.MomentoEvaluacion = void 0;
const typeorm_1 = require("typeorm");
const aplicacion_entity_1 = require("./aplicacion.entity");
const datos_campo_entity_1 = require("./datos-campo.entity");
let MomentoEvaluacion = class MomentoEvaluacion {
};
exports.MomentoEvaluacion = MomentoEvaluacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'momento_id' }),
    __metadata("design:type", Number)
], MomentoEvaluacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => aplicacion_entity_1.Aplicacion, (aplicacion) => aplicacion.momentos, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'aplicacion_id_fk' }),
    __metadata("design:type", aplicacion_entity_1.Aplicacion)
], MomentoEvaluacion.prototype, "aplicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombre_momento', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MomentoEvaluacion.prototype, "nombreMomento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dias_despues_aplicacion', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MomentoEvaluacion.prototype, "diasDespuesAplicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_evaluacion', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], MomentoEvaluacion.prototype, "fechaEvaluacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => datos_campo_entity_1.DatosCampo, (dc) => dc.momento),
    __metadata("design:type", Array)
], MomentoEvaluacion.prototype, "datosCampo", void 0);
exports.MomentoEvaluacion = MomentoEvaluacion = __decorate([
    (0, typeorm_1.Entity)('Momento_Evaluacion'),
    (0, typeorm_1.Unique)(['aplicacion', 'nombreMomento'])
], MomentoEvaluacion);
