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
exports.TipoEnsayoVariable = void 0;
const typeorm_1 = require("typeorm");
const tipo_ensayo_entity_1 = require("./tipo-ensayo.entity");
const protocolo_variable_entity_1 = require("./protocolo-variable.entity");
let TipoEnsayoVariable = class TipoEnsayoVariable {
};
exports.TipoEnsayoVariable = TipoEnsayoVariable;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'tipo_ensayo_variable_id' }),
    __metadata("design:type", Number)
], TipoEnsayoVariable.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_ensayo_entity_1.TipoEnsayo, (tipo) => tipo.variables, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tipo_ensayo_id_fk' }),
    __metadata("design:type", tipo_ensayo_entity_1.TipoEnsayo)
], TipoEnsayoVariable.prototype, "tipoEnsayo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => protocolo_variable_entity_1.ProtocoloVariable, (pv) => pv.mediciones),
    (0, typeorm_1.JoinColumn)({ name: 'variable_id_fk' }),
    __metadata("design:type", protocolo_variable_entity_1.ProtocoloVariable)
], TipoEnsayoVariable.prototype, "variable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], TipoEnsayoVariable.prototype, "orden", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TipoEnsayoVariable.prototype, "requerido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unidad_override', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], TipoEnsayoVariable.prototype, "unidadOverride", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], TipoEnsayoVariable.prototype, "escala", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rango_min', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], TipoEnsayoVariable.prototype, "rangoMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rango_max', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], TipoEnsayoVariable.prototype, "rangoMax", void 0);
exports.TipoEnsayoVariable = TipoEnsayoVariable = __decorate([
    (0, typeorm_1.Entity)('Tipo_Ensayo_Variable')
], TipoEnsayoVariable);
