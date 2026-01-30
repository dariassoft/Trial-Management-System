"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AplicacionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const aplicaciones_service_1 = require("./aplicaciones.service");
const aplicaciones_controller_1 = require("./aplicaciones.controller");
const aplicacion_entity_1 = require("../entities/aplicacion.entity");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const tipo_ensayo_evaluacion_dia_entity_1 = require("../entities/tipo-ensayo-evaluacion-dia.entity");
const momento_evaluacion_entity_1 = require("../entities/momento-evaluacion.entity");
let AplicacionesModule = class AplicacionesModule {
};
exports.AplicacionesModule = AplicacionesModule;
exports.AplicacionesModule = AplicacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([aplicacion_entity_1.Aplicacion, ensayo_entity_1.Ensayo, tipo_ensayo_evaluacion_dia_entity_1.TipoEnsayoEvaluacionDia, momento_evaluacion_entity_1.MomentoEvaluacion])],
        controllers: [aplicaciones_controller_1.AplicacionesController],
        providers: [aplicaciones_service_1.AplicacionesService],
    })
], AplicacionesModule);
