"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatosSiembraModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const datos_siembra_entity_1 = require("../entities/datos-siembra.entity");
const datos_siembra_service_1 = require("./datos-siembra.service");
const datos_siembra_controller_1 = require("./datos-siembra.controller");
const parcela_entity_1 = require("../entities/parcela.entity");
let DatosSiembraModule = class DatosSiembraModule {
};
exports.DatosSiembraModule = DatosSiembraModule;
exports.DatosSiembraModule = DatosSiembraModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([datos_siembra_entity_1.DatosSiembra, parcela_entity_1.Parcela])],
        controllers: [datos_siembra_controller_1.DatosSiembraController],
        providers: [datos_siembra_service_1.DatosSiembraService],
        exports: [datos_siembra_service_1.DatosSiembraService],
    })
], DatosSiembraModule);
