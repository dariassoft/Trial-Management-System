"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CultivoVariedadesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cultivo_variedades_service_1 = require("./cultivo-variedades.service");
const cultivo_variedades_controller_1 = require("./cultivo-variedades.controller");
const cultivo_variedad_entity_1 = require("../../entities/cultivo-variedad.entity");
const cultivo_entity_1 = require("../../entities/cultivo.entity");
let CultivoVariedadesModule = class CultivoVariedadesModule {
};
exports.CultivoVariedadesModule = CultivoVariedadesModule;
exports.CultivoVariedadesModule = CultivoVariedadesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cultivo_variedad_entity_1.CultivoVariedad, cultivo_entity_1.Cultivo])],
        controllers: [cultivo_variedades_controller_1.CultivoVariedadesController],
        providers: [cultivo_variedades_service_1.CultivoVariedadesService],
    })
], CultivoVariedadesModule);
