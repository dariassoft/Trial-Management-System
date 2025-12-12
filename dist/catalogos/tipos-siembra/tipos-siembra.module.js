"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposSiembraModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tipo_siembra_entity_1 = require("../../entities/tipo-siembra.entity");
const tipos_siembra_controller_1 = require("./tipos-siembra.controller");
const tipos_siembra_service_1 = require("./tipos-siembra.service");
let TiposSiembraModule = class TiposSiembraModule {
};
exports.TiposSiembraModule = TiposSiembraModule;
exports.TiposSiembraModule = TiposSiembraModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tipo_siembra_entity_1.TipoSiembra])],
        controllers: [tipos_siembra_controller_1.TiposSiembraController],
        providers: [tipos_siembra_service_1.TiposSiembraService],
    })
], TiposSiembraModule);
