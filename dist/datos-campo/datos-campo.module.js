"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatosCampoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const datos_campo_service_1 = require("./datos-campo.service");
const datos_campo_controller_1 = require("./datos-campo.controller");
const datos_campo_medicion_entity_1 = require("../entities/datos-campo-medicion.entity");
const protocolo_variable_entity_1 = require("../entities/protocolo-variable.entity");
const fotos_module_1 = require("../fotos/fotos.module");
let DatosCampoModule = class DatosCampoModule {
};
exports.DatosCampoModule = DatosCampoModule;
exports.DatosCampoModule = DatosCampoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([datos_campo_entity_1.DatosCampo, datos_campo_medicion_entity_1.DatosCampoMedicion, protocolo_variable_entity_1.ProtocoloVariable]), fotos_module_1.FotosModule],
        controllers: [datos_campo_controller_1.DatosCampoController],
        providers: [datos_campo_service_1.DatosCampoService],
    })
], DatosCampoModule);
