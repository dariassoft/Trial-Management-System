"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TratamientosProductoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tratamientos_producto_service_1 = require("./tratamientos-producto.service");
const tratamientos_producto_controller_1 = require("./tratamientos-producto.controller");
const tratamiento_producto_entity_1 = require("../entities/tratamiento-producto.entity");
let TratamientosProductoModule = class TratamientosProductoModule {
};
exports.TratamientosProductoModule = TratamientosProductoModule;
exports.TratamientosProductoModule = TratamientosProductoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tratamiento_producto_entity_1.TratamientoProducto])],
        controllers: [tratamientos_producto_controller_1.TratamientosProductoController],
        providers: [tratamientos_producto_service_1.TratamientosProductoService],
    })
], TratamientosProductoModule);
