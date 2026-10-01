"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ImportacionReportesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const ExcelJS = __importStar(require("exceljs"));
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const parcela_entity_1 = require("../entities/parcela.entity");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const datos_campo_medicion_entity_1 = require("../entities/datos-campo-medicion.entity");
const datos_cosecha_entity_1 = require("../entities/datos-cosecha.entity");
const protocolo_variable_entity_1 = require("../entities/protocolo-variable.entity");
const momento_evaluacion_entity_1 = require("../entities/momento-evaluacion.entity");
const importacion_ensayo_log_entity_1 = require("../entities/importacion-ensayo-log.entity");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
const notificacion_entity_1 = require("../notificaciones/entities/notificacion.entity");
const SHEETS = ['Resumen', 'Evaluaciones Fechas', 'Evaluaciones Detalle', 'Datos Campo', 'Datos Cosecha', 'Estadísticas', 'Análisis Gráfico'];
const CAMPO_HEADERS = ['Parcela', 'Tratamiento', 'Bloque', 'Momento', 'Variable', 'Valor'];
const COSECHA_HEADERS = ['Parcela', 'Tratamiento', 'Bloque', 'Humedad %', 'kg/ha (corregido)', 'Peso Grano (g)', 'Humedad Grano (%)', 'Superficie (m²)', 'GIE %', 'Larvas', 'Benéficos'];
let ImportacionReportesService = class ImportacionReportesService {
    constructor(req, dataSource, ensayoRepo, parcelaRepo, notificaciones) {
        this.req = req;
        this.dataSource = dataSource;
        this.ensayoRepo = ensayoRepo;
        this.parcelaRepo = parcelaRepo;
        this.notificaciones = notificaciones;
    }
    value(cell) {
        const v = cell.value;
        if (v && typeof v === 'object' && 'result' in v)
            return v.result;
        if (v && typeof v === 'object' && 'text' in v)
            return v.text;
        return v;
    }
    text(value) { return String(value !== null && value !== void 0 ? value : '').trim(); }
    number(value, row, column, required = false) {
        if (value === null || value === undefined || this.text(value) === '') {
            if (required)
                throw new common_1.BadRequestException(`La hoja contiene un valor vacío en ${column}${row}`);
            return null;
        }
        const n = Number(this.text(value).replace('%', '').replace(',', '.').replace(/[^0-9.+-]/g, ''));
        if (!Number.isFinite(n))
            throw new common_1.BadRequestException(`Valor numérico inválido en ${column}${row}`);
        return n;
    }
    headers(sheet, expected) {
        const actual = expected.map((_, i) => this.text(this.value(sheet.getCell(1, i + 1))));
        if (actual.length !== expected.length || actual.some((h, i) => h !== expected[i])) {
            throw new common_1.BadRequestException(`Formato incompatible en la hoja "${sheet.name}": encabezados no válidos`);
        }
    }
    importar(buffer, ensayoEsperadoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const wb = new ExcelJS.Workbook();
            try {
                yield wb.xlsx.load(buffer);
            }
            catch (_h) {
                throw new common_1.BadRequestException('El archivo no es un Excel XLSX válido');
            }
            if (wb.worksheets.map(s => s.name).join('|') !== SHEETS.join('|')) {
                throw new common_1.BadRequestException('El archivo no es compatible: debe contener exactamente las hojas del reporte Excel');
            }
            const resumen = wb.getWorksheet('Resumen');
            if (this.text(this.value(resumen.getCell('A3'))) !== 'ID Ensayo')
                throw new common_1.BadRequestException('El archivo no es compatible: falta Resumen!A3');
            const ensayoId = this.number(this.value(resumen.getCell('B3')), 3, 'B', true);
            if (ensayoEsperadoId !== undefined && ensayoId !== ensayoEsperadoId) {
                throw new common_1.BadRequestException(`El archivo corresponde al ensayo ${ensayoId}, no al ensayo seleccionado ${ensayoEsperadoId}`);
            }
            const ensayo = yield this.ensayoRepo.findOne({ where: { id: ensayoId }, relations: ['responsable', 'tipoEnsayo'] });
            if (!ensayo)
                throw new common_1.BadRequestException(`El ensayo ${ensayoId} indicado en Resumen!B3 no existe`);
            const campo = wb.getWorksheet('Datos Campo');
            const cosecha = wb.getWorksheet('Datos Cosecha');
            this.headers(campo, CAMPO_HEADERS);
            this.headers(cosecha, COSECHA_HEADERS);
            const parcelas = yield this.parcelaRepo.find({ where: { ensayo: { id: ensayoId } }, relations: ['bloque', 'tratamiento'] });
            const parcelaMap = new Map(parcelas.map(p => [this.text(p.nombreParcela), p]));
            const cambios = { 'Datos Campo': 0, 'Datos Cosecha': 0 };
            const qr = this.dataSource.createQueryRunner();
            yield qr.connect();
            yield qr.startTransaction();
            try {
                for (let r = 2; r <= campo.rowCount; r++) {
                    const row = campo.getRow(r);
                    if (this.text(this.value(row.getCell(1))) === '')
                        continue;
                    const parcela = parcelaMap.get(this.text(this.value(row.getCell(1))));
                    if (!parcela)
                        throw new common_1.BadRequestException(`Parcela inválida en Datos Campo fila ${r}`);
                    if (this.text(this.value(row.getCell(2))) !== this.text((_a = parcela.tratamiento) === null || _a === void 0 ? void 0 : _a.numeroTrat) || this.text(this.value(row.getCell(3))) !== this.text((_b = parcela.bloque) === null || _b === void 0 ? void 0 : _b.nombreBloque))
                        throw new common_1.BadRequestException(`Identificación inconsistente en Datos Campo fila ${r}`);
                    const momento = yield qr.manager.getRepository(momento_evaluacion_entity_1.MomentoEvaluacion).createQueryBuilder('m')
                        .leftJoinAndSelect('m.aplicacion', 'a')
                        .leftJoin('a.ensayo', 'e')
                        .where('m.nombre_momento = :nombre', { nombre: this.text(this.value(row.getCell(4))) })
                        .andWhere('e.ensayo_id = :ensayoId', { ensayoId })
                        .getOne();
                    if (!momento)
                        throw new common_1.BadRequestException(`Momento inválido en Datos Campo fila ${r}`);
                    const variable = yield qr.manager.getRepository(protocolo_variable_entity_1.ProtocoloVariable).createQueryBuilder('v')
                        .leftJoin('v.tipoEnsayo', 'te')
                        .where('v.nombre_variable = :nombre', { nombre: this.text(this.value(row.getCell(5))) })
                        .andWhere('te.tipo_ensayo_id = :tipoId', { tipoId: (_c = ensayo.tipoEnsayo) === null || _c === void 0 ? void 0 : _c.id })
                        .getOne();
                    if (!variable)
                        throw new common_1.BadRequestException(`Variable inválida en Datos Campo fila ${r}`);
                    let visita = yield qr.manager.getRepository(datos_campo_entity_1.DatosCampo).findOne({ where: { parcela: { id: parcela.id }, momento: { id: momento.id } }, relations: ['mediciones', 'mediciones.variable'] });
                    let medicion = (_d = visita === null || visita === void 0 ? void 0 : visita.mediciones) === null || _d === void 0 ? void 0 : _d.find(m => { var _a; return ((_a = m.variable) === null || _a === void 0 ? void 0 : _a.id) === variable.id; });
                    const valor = this.value(row.getCell(6));
                    if (!visita) {
                        visita = qr.manager.create(datos_campo_entity_1.DatosCampo, { parcela: { id: parcela.id }, momento: { id: momento.id } });
                        visita = yield qr.manager.save(visita);
                    }
                    if (!medicion)
                        medicion = qr.manager.create(datos_campo_medicion_entity_1.DatosCampoMedicion, { visita, variable: { id: variable.id } });
                    const nuevo = valor === null || valor === undefined || this.text(valor) === '' ? '' : this.text(valor);
                    if (medicion.valor !== nuevo) {
                        medicion.valor = nuevo;
                        yield qr.manager.save(medicion);
                        cambios['Datos Campo']++;
                    }
                }
                for (let r = 2; r <= cosecha.rowCount; r++) {
                    const row = cosecha.getRow(r);
                    if (this.text(this.value(row.getCell(1))) === '')
                        continue;
                    const parcela = parcelaMap.get(this.text(this.value(row.getCell(1))));
                    if (!parcela)
                        throw new common_1.BadRequestException(`Parcela inválida en Datos Cosecha fila ${r}`);
                    if (this.text(this.value(row.getCell(2))) !== this.text((_e = parcela.tratamiento) === null || _e === void 0 ? void 0 : _e.numeroTrat) || this.text(this.value(row.getCell(3))) !== this.text((_f = parcela.bloque) === null || _f === void 0 ? void 0 : _f.nombreBloque))
                        throw new common_1.BadRequestException(`Identificación inconsistente en Datos Cosecha fila ${r}`);
                    const input = { humedadPct: this.number(this.value(row.getCell(4)), r, 'D'), pesoGranoCosechado: this.number(this.value(row.getCell(6)), r, 'F'), humedadGranoCosechado: this.number(this.value(row.getCell(7)), r, 'G'), superficieCosechadaM2: this.number(this.value(row.getCell(8)), r, 'H'), gie: this.number(this.value(row.getCell(9)), r, 'I'), larvasPorUrf: this.number(this.value(row.getCell(10)), r, 'J'), insectosBeneficiosPorUrf: this.number(this.value(row.getCell(11)), r, 'K') };
                    const kgHa = input.pesoGranoCosechado != null && input.superficieCosechadaM2 && input.superficieCosechadaM2 > 0 ? ((input.pesoGranoCosechado / 1000) / input.superficieCosechadaM2 * 10000) * (input.humedadGranoCosechado == null ? 1 : 1 - ((input.humedadGranoCosechado - 13.5) / 86.5)) : null;
                    let entity = yield qr.manager.findOne(datos_cosecha_entity_1.DatosCosecha, { where: { parcela: { id: parcela.id } } });
                    if (!entity)
                        entity = qr.manager.create(datos_cosecha_entity_1.DatosCosecha, { parcela: { id: parcela.id } });
                    const kgHaImportado = this.number(this.value(row.getCell(5)), r, 'E');
                    const nuevosValores = Object.assign(Object.assign({}, input), { kgHaCorregido: kgHa == null ? kgHaImportado : kgHa });
                    const cambio = Object.entries(nuevosValores).some(([key, value]) => Number(entity[key]) !== Number(value));
                    Object.assign(entity, nuevosValores);
                    yield qr.manager.save(entity);
                    if (cambio)
                        cambios['Datos Cosecha']++;
                }
                const changedSheets = Object.entries(cambios).filter(([, n]) => n > 0);
                const user = this.req.user;
                const resumenCambios = changedSheets.map(([sheet, count]) => `${sheet}: ${count} fila(s)`).join('; ') || 'Sin cambios';
                yield qr.manager.save(importacion_ensayo_log_entity_1.ImportacionEnsayoLog, { ensayo: { id: ensayoId }, usuario: { id: user.sub }, hojasModificadas: changedSheets.length, resumen: resumenCambios });
                yield qr.commitTransaction();
                const destinatarios = new Set([user.sub, (_g = ensayo.responsable) === null || _g === void 0 ? void 0 : _g.id].filter(Boolean));
                for (const usuarioId of destinatarios)
                    yield this.notificaciones.create({ usuarioId, titulo: `Importación Excel - Ensayo #${ensayoId}`, descripcion: `Se importaron mediciones en ${resumenCambios}. Usuario: ${user.username}.`, tipo: notificacion_entity_1.TipoNotificacion.GENERAL, ensayoId, link: `/ensayos/${ensayoId}` });
                return { ensayoId, cambios, totalCambios: Object.values(cambios).reduce((a, b) => a + b, 0) };
            }
            catch (error) {
                yield qr.rollbackTransaction();
                throw error;
            }
            finally {
                yield qr.release();
            }
        });
    }
};
exports.ImportacionReportesService = ImportacionReportesService;
exports.ImportacionReportesService = ImportacionReportesService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(2, (0, typeorm_2.InjectRepository)(ensayo_entity_1.Ensayo)),
    __param(3, (0, typeorm_2.InjectRepository)(parcela_entity_1.Parcela)),
    __metadata("design:paramtypes", [Object, typeorm_1.DataSource,
        typeorm_1.Repository,
        typeorm_1.Repository,
        notificaciones_service_1.NotificacionesService])
], ImportacionReportesService);
