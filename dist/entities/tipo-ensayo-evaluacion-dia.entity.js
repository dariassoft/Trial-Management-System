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
exports.TipoEnsayoEvaluacionDia = void 0;
const typeorm_1 = require("typeorm");
const tipo_ensayo_entity_1 = require("./tipo-ensayo.entity");
let TipoEnsayoEvaluacionDia = class TipoEnsayoEvaluacionDia {
};
exports.TipoEnsayoEvaluacionDia = TipoEnsayoEvaluacionDia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tipo_eval_dia_id' }),
    __metadata("design:type", Number)
], TipoEnsayoEvaluacionDia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_ensayo_entity_1.TipoEnsayo, (tipo) => tipo.dias, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tipo_ensayo_id_fk' }),
    __metadata("design:type", tipo_ensayo_entity_1.TipoEnsayo)
], TipoEnsayoEvaluacionDia.prototype, "tipoEnsayo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], TipoEnsayoEvaluacionDia.prototype, "dia", void 0);
exports.TipoEnsayoEvaluacionDia = TipoEnsayoEvaluacionDia = __decorate([
    (0, typeorm_1.Entity)('Tipo_Ensayo_EvaluacionDia')
], TipoEnsayoEvaluacionDia);
