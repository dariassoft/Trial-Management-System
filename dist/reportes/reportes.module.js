"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reportes_service_1 = require("./reportes.service");
const reportes_controller_1 = require("./reportes.controller");
const calculos_reportes_service_1 = require("./calculos-reportes.service");
const reportes_especializados_service_1 = require("./reportes-especializados.service");
const svg_charts_service_1 = require("./svg-charts.service");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const parcela_entity_1 = require("../entities/parcela.entity");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const datos_campo_medicion_entity_1 = require("../entities/datos-campo-medicion.entity");
const datos_cosecha_entity_1 = require("../entities/datos-cosecha.entity");
const tratamiento_entity_1 = require("../entities/tratamiento.entity");
const bloque_entity_1 = require("../entities/bloque.entity");
const aplicacion_entity_1 = require("../entities/aplicacion.entity");
let ReportesModule = class ReportesModule {
};
exports.ReportesModule = ReportesModule;
exports.ReportesModule = ReportesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                ensayo_entity_1.Ensayo,
                parcela_entity_1.Parcela,
                datos_campo_entity_1.DatosCampo,
                datos_campo_medicion_entity_1.DatosCampoMedicion,
                datos_cosecha_entity_1.DatosCosecha,
                tratamiento_entity_1.Tratamiento,
                bloque_entity_1.Bloque,
                aplicacion_entity_1.Aplicacion,
            ]),
        ],
        controllers: [reportes_controller_1.ReportesController],
        providers: [
            reportes_service_1.ReportesService,
            calculos_reportes_service_1.CalculosReportesService,
            reportes_especializados_service_1.ReportesEspecializadosService,
            svg_charts_service_1.SvgChartsService,
        ],
        exports: [reportes_service_1.ReportesService, calculos_reportes_service_1.CalculosReportesService, reportes_especializados_service_1.ReportesEspecializadosService, svg_charts_service_1.SvgChartsService],
    })
], ReportesModule);
