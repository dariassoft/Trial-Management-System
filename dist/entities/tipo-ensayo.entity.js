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
exports.TipoEnsayo = void 0;
const typeorm_1 = require("typeorm");
const tipo_ensayo_variable_entity_1 = require("./tipo-ensayo-variable.entity");
const tipo_ensayo_evaluacion_dia_entity_1 = require("./tipo-ensayo-evaluacion-dia.entity");
let TipoEnsayo = class TipoEnsayo {
};
exports.TipoEnsayo = TipoEnsayo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tipo_ensayo_id' }),
    __metadata("design:type", Number)
], TipoEnsayo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120, unique: true }),
    __metadata("design:type", String)
], TipoEnsayo.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TipoEnsayo.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'evaluacion_csv', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], TipoEnsayo.prototype, "evaluacionCsv", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], TipoEnsayo.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TipoEnsayo.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TipoEnsayo.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tipo_ensayo_variable_entity_1.TipoEnsayoVariable, (tev) => tev.tipoEnsayo),
    __metadata("design:type", Array)
], TipoEnsayo.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tipo_ensayo_evaluacion_dia_entity_1.TipoEnsayoEvaluacionDia, (dia) => dia.tipoEnsayo),
    __metadata("design:type", Array)
], TipoEnsayo.prototype, "dias", void 0);
exports.TipoEnsayo = TipoEnsayo = __decorate([
    (0, typeorm_1.Entity)('Tipo_Ensayo')
], TipoEnsayo);
