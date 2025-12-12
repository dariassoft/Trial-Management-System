"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FotosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const foto_registro_entity_1 = require("../entities/foto-registro.entity");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const fotos_service_1 = require("./fotos.service");
const fotos_controller_1 = require("./fotos.controller");
let FotosModule = class FotosModule {
};
exports.FotosModule = FotosModule;
exports.FotosModule = FotosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([foto_registro_entity_1.FotoRegistro, datos_campo_entity_1.DatosCampo])],
        controllers: [fotos_controller_1.FotosController],
        providers: [fotos_service_1.FotosService],
        exports: [fotos_service_1.FotosService],
    })
], FotosModule);
