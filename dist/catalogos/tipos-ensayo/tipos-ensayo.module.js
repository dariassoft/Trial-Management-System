"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposEnsayoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tipos_ensayo_service_1 = require("./tipos-ensayo.service");
const tipos_ensayo_controller_1 = require("./tipos-ensayo.controller");
const tipo_ensayo_entity_1 = require("../../entities/tipo-ensayo.entity");
const tipo_ensayo_variable_entity_1 = require("../../entities/tipo-ensayo-variable.entity");
const protocolo_variable_entity_1 = require("../../entities/protocolo-variable.entity");
const tipo_ensayo_evaluacion_dia_entity_1 = require("../../entities/tipo-ensayo-evaluacion-dia.entity");
let TiposEnsayoModule = class TiposEnsayoModule {
};
exports.TiposEnsayoModule = TiposEnsayoModule;
exports.TiposEnsayoModule = TiposEnsayoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tipo_ensayo_entity_1.TipoEnsayo, tipo_ensayo_variable_entity_1.TipoEnsayoVariable, protocolo_variable_entity_1.ProtocoloVariable, tipo_ensayo_evaluacion_dia_entity_1.TipoEnsayoEvaluacionDia])],
        controllers: [tipos_ensayo_controller_1.TiposEnsayoController],
        providers: [tipos_ensayo_service_1.TiposEnsayoService],
        exports: [tipos_ensayo_service_1.TiposEnsayoService],
    })
], TiposEnsayoModule);
