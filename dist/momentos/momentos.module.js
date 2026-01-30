"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MomentosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const momentos_service_1 = require("./momentos.service");
const momentos_controller_1 = require("./momentos.controller");
const momento_evaluacion_entity_1 = require("../entities/momento-evaluacion.entity");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const parcela_entity_1 = require("../entities/parcela.entity");
let MomentosModule = class MomentosModule {
};
exports.MomentosModule = MomentosModule;
exports.MomentosModule = MomentosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([momento_evaluacion_entity_1.MomentoEvaluacion, datos_campo_entity_1.DatosCampo, parcela_entity_1.Parcela])],
        controllers: [momentos_controller_1.MomentosController],
        providers: [momentos_service_1.MomentosService],
    })
], MomentosModule);
