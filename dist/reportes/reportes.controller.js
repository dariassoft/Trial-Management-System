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
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const reportes_service_1 = require("./reportes.service");
const importacion_reportes_service_1 = require("./importacion-reportes.service");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let ReportesController = class ReportesController {
    constructor(reportesService, importacionService) {
        this.reportesService = reportesService;
        this.importacionService = importacionService;
    }
    generarReportePdf(ensayoId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`📄 Generando PDF para ensayo ${ensayoId}`);
                // Usar generarPDFEnsayo que obtiene TODOS los datos incluyendo larvas_porurf
                const buffer = yield this.reportesService.generarPDFEnsayo(ensayoId);
                if (!buffer) {
                    return res.status(404).json({ error: 'No se pudo generar el PDF' });
                }
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
    importarExcel(archivo, ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(archivo === null || archivo === void 0 ? void 0 : archivo.buffer))
                throw new common_1.BadRequestException('Debe adjuntar un archivo Excel');
            return this.importacionService.importar(archivo.buffer, ensayoId ? Number(ensayoId) : undefined);
        });
    }
    generarReporteXls(ensayoId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`📊 Generando Excel para ensayo ${ensayoId}`);
                // Usar el nuevo método que genera Excel COMPLETO como el PDF
                const buffer = yield this.reportesService.generarExcelEnsayo(ensayoId);
                if (!buffer) {
                    return res.status(404).json({ error: 'No se pudo generar el Excel' });
                }
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
};
exports.ReportesController = ReportesController;
__decorate([
    (0, common_1.Get)('ensayo/:ensayoId/pdf'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar reporte PDF completo de un ensayo' }),
    (0, swagger_1.ApiParam)({ name: 'ensayoId', type: Number }),
    __param(0, (0, common_1.Param)('ensayoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "generarReportePdf", null);
__decorate([
    (0, common_1.Post)('importar'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('archivo')),
    (0, swagger_1.ApiOperation)({ summary: 'Importar mediciones desde un Excel generado por el sistema' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('ensayoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "importarExcel", null);
__decorate([
    (0, common_1.Get)('ensayo/:ensayoId/xls'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar reporte Excel COMPLETO de un ensayo (igual que PDF)' }),
    (0, swagger_1.ApiParam)({ name: 'ensayoId', type: Number }),
    __param(0, (0, common_1.Param)('ensayoId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ReportesController.prototype, "generarReporteXls", null);
exports.ReportesController = ReportesController = __decorate([
    (0, swagger_1.ApiTags)('reportes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reportes'),
    __param(1, (0, common_1.Optional)()),
    __metadata("design:paramtypes", [reportes_service_1.ReportesService,
        importacion_reportes_service_1.ImportacionReportesService])
], ReportesController);
