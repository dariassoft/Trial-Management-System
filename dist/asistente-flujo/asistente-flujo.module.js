"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsistenteFlujoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const asistente_flujo_controller_1 = require("./asistente-flujo.controller");
const asistente_flujo_service_1 = require("./asistente-flujo.service");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const bloque_entity_1 = require("../entities/bloque.entity");
const parcela_entity_1 = require("../entities/parcela.entity");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const datos_siembra_entity_1 = require("../entities/datos-siembra.entity");
const datos_cosecha_entity_1 = require("../entities/datos-cosecha.entity");
const protocolo_entity_1 = require("../entities/protocolo.entity");
const tratamiento_entity_1 = require("../entities/tratamiento.entity");
const tratamiento_producto_entity_1 = require("../entities/tratamiento-producto.entity");
const laboratorio_entity_1 = require("../entities/laboratorio.entity");
const producto_entity_1 = require("../entities/producto.entity");
const tipo_ensayo_entity_1 = require("../entities/tipo-ensayo.entity");
const tipo_ensayo_variable_entity_1 = require("../entities/tipo-ensayo-variable.entity");
const tipo_ensayo_evaluacion_dia_entity_1 = require("../entities/tipo-ensayo-evaluacion-dia.entity");
const protocolo_variable_entity_1 = require("../entities/protocolo-variable.entity");
const aplicacion_entity_1 = require("../entities/aplicacion.entity");
const momento_evaluacion_entity_1 = require("../entities/momento-evaluacion.entity");
let AsistenteFlujoModule = class AsistenteFlujoModule {
};
exports.AsistenteFlujoModule = AsistenteFlujoModule;
exports.AsistenteFlujoModule = AsistenteFlujoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ensayo_entity_1.Ensayo,
                bloque_entity_1.Bloque,
                parcela_entity_1.Parcela,
                datos_campo_entity_1.DatosCampo,
                datos_siembra_entity_1.DatosSiembra,
                datos_cosecha_entity_1.DatosCosecha,
                protocolo_entity_1.Protocolo,
                tratamiento_entity_1.Tratamiento,
                tratamiento_producto_entity_1.TratamientoProducto,
                laboratorio_entity_1.Laboratorio,
                producto_entity_1.Producto,
                tipo_ensayo_entity_1.TipoEnsayo,
                tipo_ensayo_variable_entity_1.TipoEnsayoVariable,
                tipo_ensayo_evaluacion_dia_entity_1.TipoEnsayoEvaluacionDia,
                protocolo_variable_entity_1.ProtocoloVariable,
                aplicacion_entity_1.Aplicacion,
                momento_evaluacion_entity_1.MomentoEvaluacion,
            ]),
        ],
        controllers: [asistente_flujo_controller_1.AsistenteFlujoController],
        providers: [asistente_flujo_service_1.AsistenteFlujoService],
    })
], AsistenteFlujoModule);
