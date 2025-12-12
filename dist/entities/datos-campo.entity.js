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
exports.DatosCampo = void 0;
const typeorm_1 = require("typeorm");
const parcela_entity_1 = require("./parcela.entity");
const momento_evaluacion_entity_1 = require("./momento-evaluacion.entity");
const datos_campo_medicion_entity_1 = require("./datos-campo-medicion.entity");
const foto_registro_entity_1 = require("./foto-registro.entity");
let DatosCampo = class DatosCampo {
};
exports.DatosCampo = DatosCampo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'dato_campo_id' }),
    __metadata("design:type", Number)
], DatosCampo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => parcela_entity_1.Parcela, (parcela) => parcela.datosCampo, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'parcela_id_fk' }),
    __metadata("design:type", parcela_entity_1.Parcela)
], DatosCampo.prototype, "parcela", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => momento_evaluacion_entity_1.MomentoEvaluacion, (momento) => momento.datosCampo, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'momento_id_fk' }),
    __metadata("design:type", momento_evaluacion_entity_1.MomentoEvaluacion)
], DatosCampo.prototype, "momento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DatosCampo.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => datos_campo_medicion_entity_1.DatosCampoMedicion, (medicion) => medicion.visita, { cascade: true }),
    __metadata("design:type", Array)
], DatosCampo.prototype, "mediciones", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => foto_registro_entity_1.FotoRegistro, (foto) => foto.visita),
    __metadata("design:type", Array)
], DatosCampo.prototype, "fotos", void 0);
exports.DatosCampo = DatosCampo = __decorate([
    (0, typeorm_1.Entity)('Datos_Campo'),
    (0, typeorm_1.Unique)(['parcela', 'momento'])
], DatosCampo);
