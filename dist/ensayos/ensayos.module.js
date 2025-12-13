"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsayosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ensayos_service_1 = require("./ensayos.service");
const ensayos_controller_1 = require("./ensayos.controller");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const laboratorio_entity_1 = require("../entities/laboratorio.entity");
const tipo_ensayo_entity_1 = require("../entities/tipo-ensayo.entity");
const protocolo_entity_1 = require("../entities/protocolo.entity");
const usuario_entity_1 = require("../entities/usuario.entity");
const cultivo_entity_1 = require("../entities/cultivo.entity");
const cultivo_variedad_entity_1 = require("../entities/cultivo-variedad.entity");
const tipo_siembra_entity_1 = require("../entities/tipo-siembra.entity");
const status_ensayo_entity_1 = require("../entities/status-ensayo.entity");
const protocolos_module_1 = require("../protocolos/protocolos.module");
let EnsayosModule = class EnsayosModule {
};
exports.EnsayosModule = EnsayosModule;
exports.EnsayosModule = EnsayosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ensayo_entity_1.Ensayo,
                laboratorio_entity_1.Laboratorio,
                tipo_ensayo_entity_1.TipoEnsayo,
                protocolo_entity_1.Protocolo,
                usuario_entity_1.Usuario,
                cultivo_entity_1.Cultivo,
                cultivo_variedad_entity_1.CultivoVariedad,
                tipo_siembra_entity_1.TipoSiembra,
                status_ensayo_entity_1.StatusEnsayo,
            ]),
            protocolos_module_1.ProtocolosModule,
        ],
        controllers: [ensayos_controller_1.EnsayosController],
        providers: [ensayos_service_1.EnsayosService],
    })
], EnsayosModule);
