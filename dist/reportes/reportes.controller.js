"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reportes_service_1 = require("./reportes.service");
let ReportesController = class ReportesController {
    constructor(reportesService) {
        this.reportesService = reportesService;
    }
    generarReportePdf(ensayoId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`📄 Generando PDF para ensayo ${ensayoId}`);
                // Obtener datos del ensayo desde la BD
                const { datosCampo, datosTrilla, metadadatos } = yield this.reportesService.obtenerDatosEnsayo(ensayoId);
                console.log(`  ✅ Datos de campo: ${datosCampo.length} registros`);
                console.log(`  ✅ Datos de trilla: ${datosTrilla.length} registros`);
                console.log(`  ✅ Metadata: ${JSON.stringify(metadadatos).substring(0, 100)}...`);
                const buffer = yield this.reportesService.generarPDF(datosCampo, datosTrilla, metadadatos);
                console.log(`  ✅ PDF generado: ${buffer.length} bytes`);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="ensayo_${ensayoId}_${new Date().toISOString().split('T')[0]}.pdf"`);
                res.send(buffer);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error('❌ Error generando PDF:', errorMessage);
                console.error('Stack:', error.stack);
                res
                    .status(500)
                    .json({ error: 'Error al generar PDF', details: errorMessage });
            }
        });
    }
    generarReporteXls(ensayoId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`📊 Generando Excel para ensayo ${ensayoId}`);
                // Obtener datos del ensayo desde la BD
                const { datosCampo, datosTrilla, metadadatos } = yield this.reportesService.obtenerDatosEnsayo(ensayoId);
                console.log(`  ✅ Datos de campo: ${datosCampo.length} registros`);
                console.log(`  ✅ Datos de trilla: ${datosTrilla.length} registros`);
                const buffer = yield this.reportesService.generarExcel(datosCampo, datosTrilla, metadadatos);
                console.log(`  ✅ Excel generado: ${buffer.length} bytes`);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename="ensayo_${ensayoId}_${new Date().toISOString().split('T')[0]}.xlsx"`);
                res.send(buffer);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error('❌ Error generando Excel:', errorMessage);
                console.error('Stack:', error.stack);
                res
                    .status(500)
                    .json({ error: 'Error al generar Excel', details: errorMessage });
            }
        });
    }
    vistaPreviaReporte(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`👁️  Vista previa para ensayo ${ensayoId}`);
                // Obtener datos del ensayo desde la BD
                const { datosCampo, datosTrilla, metadadatos } = yield this.reportesService.obtenerDatosEnsayo(ensayoId);
                const estadisticas = this.reportesService.calcularEstadisticasPorTratamiento(datosTrilla || [], 'kgHa');
                const resumen = this.reportesService.generarResumenEjecutivo(datosCampo || [], datosTrilla || [], metadadatos);
                console.log(`  ✅ Vista previa generada`);
                return {
                    ensayoId,
                    estadisticas,
                    resumen,
                    datosCampoCount: (datosCampo === null || datosCampo === void 0 ? void 0 : datosCampo.length) || 0,
                    datosTrillaCount: (datosTrilla === null || datosTrilla === void 0 ? void 0 : datosTrilla.length) || 0,
                    metadata: metadadatos,
                };
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error('❌ Error en vista previa:', errorMessage);
                console.error('Stack:', error.stack);
                return { error: 'Error al procesar datos', details: errorMessage };
            }
        });
    }
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('ensayo/:ensayoId/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar reporte PDF de un ensayo' }),
    (0, swagger_1.ApiParam)({ name: 'ensayoId', type: Number }),
    __param(0, (0, common_1.Param)('ensayoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "generarReportePdf", null);
__decorate([
    (0, common_1.Get)('ensayo/:ensayoId/xls'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar reporte Excel de un ensayo' }),
    (0, swagger_1.ApiParam)({ name: 'ensayoId', type: Number }),
    __param(0, (0, common_1.Param)('ensayoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "generarReporteXls", null);
__decorate([
    (0, common_1.Get)('ensayo/:ensayoId/vista-previa'),
    (0, swagger_1.ApiOperation)({ summary: 'Vista previa de reporte con datos crudos' }),
    (0, swagger_1.ApiParam)({ name: 'ensayoId', type: Number }),
    __param(0, (0, common_1.Param)('ensayoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "vistaPreviaReporte", null);
exports.ReportesController = ReportesController = __decorate([
    (0, swagger_1.ApiTags)('reportes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reportes'),
    __metadata("design:paramtypes", [reportes_service_1.ReportesService])
], ReportesController);
