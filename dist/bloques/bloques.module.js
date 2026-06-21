"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BloquesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bloques_service_1 = require("./bloques.service");
const bloques_controller_1 = require("./bloques.controller");
const bloque_entity_1 = require("../entities/bloque.entity");
const ensayo_entity_1 = require("../entities/ensayo.entity");
let BloquesModule = class BloquesModule {
};
exports.BloquesModule = BloquesModule;
exports.BloquesModule = BloquesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([bloque_entity_1.Bloque, ensayo_entity_1.Ensayo])],
        controllers: [bloques_controller_1.BloquesController],
        providers: [bloques_service_1.BloquesService],
    })
], BloquesModule);
