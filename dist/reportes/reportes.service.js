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
exports.ReportesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const excel_generator_1 = require("./excel-generator");
const pdf_generator_1 = require("./pdf-generator");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const parcela_entity_1 = require("../entities/parcela.entity");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const datos_campo_medicion_entity_1 = require("../entities/datos-campo-medicion.entity");
const datos_cosecha_entity_1 = require("../entities/datos-cosecha.entity");
const tratamiento_entity_1 = require("../entities/tratamiento.entity");
const bloque_entity_1 = require("../entities/bloque.entity");
let ReportesService = class ReportesService {
    constructor(ensayoRepository, parcelaRepository, datosCampoRepository, datosCampoMedicionRepository, datosCosechaRepository, tratamientoRepository, bloqueRepository) {
        this.ensayoRepository = ensayoRepository;
        this.parcelaRepository = parcelaRepository;
        this.datosCampoRepository = datosCampoRepository;
        this.datosCampoMedicionRepository = datosCampoMedicionRepository;
        this.datosCosechaRepository = datosCosechaRepository;
        this.tratamientoRepository = tratamientoRepository;
        this.bloqueRepository = bloqueRepository;
    }
    /**
     * Obtiene todos los datos de un ensayo desde la BD
     */
    obtenerDatosEnsayo(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            try {
                console.log(`📥 Obteniendo datos para ensayo ${ensayoId}...`);
                // 1. Obtener ensayo base
                const ensayo = yield this.ensayoRepository.findOne({
                    where: { id: ensayoId },
                    relations: [
                        'laboratorio',
                        'cultivo',
                        'variedad',
                        'tipoSiembra',
                        'protocolo',
                        'responsable',
                        'parcelas',
                        'parcelas.bloque',
                        'parcelas.tratamiento',
                    ],
                });
                if (!ensayo) {
                    console.warn(`⚠️  Ensayo ${ensayoId} no encontrado`);
                    return { ensayo: null, datosCampo: [], datosTrilla: [], metadadatos: {} };
                }
                console.log(`✅ Ensayo: ${ensayo.nombreEnsayo}, ${((_a = ensayo.parcelas) === null || _a === void 0 ? void 0 : _a.length) || 0} parcelas`);
                // 2. Obtener datos de campo
                const datosCampoRaw = yield this.datosCampoRepository
                    .createQueryBuilder('dc')
                    .leftJoinAndSelect('dc.parcela', 'p')
                    .leftJoinAndSelect('p.tratamiento', 't')
                    .leftJoinAndSelect('p.bloque', 'b')
                    .leftJoinAndSelect('dc.mediciones', 'm')
                    .leftJoinAndSelect('m.variable', 'v')
                    .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
                    .getMany();
                console.log(`✅ Datos campo: ${datosCampoRaw.length} registros`);
                // 3. Procesar datos de campo
                const datosCampo = [];
                const parcelaMap = new Map();
                for (const dato of datosCampoRaw) {
                    const parcelaId = (_b = dato.parcela) === null || _b === void 0 ? void 0 : _b.id;
                    if (!parcelaMap.has(parcelaId)) {
                        parcelaMap.set(parcelaId, {
                            tratamiento: ((_d = (_c = dato.parcela) === null || _c === void 0 ? void 0 : _c.tratamiento) === null || _d === void 0 ? void 0 : _d.id) || 1,
                            bloque: ((_f = (_e = dato.parcela) === null || _e === void 0 ? void 0 : _e.bloque) === null || _f === void 0 ? void 0 : _f.nombreBloque) || 'B',
                            parcela: ((_g = dato.parcela) === null || _g === void 0 ? void 0 : _g.nombreParcela) || `P${parcelaId}`,
                        });
                    }
                    const fila = parcelaMap.get(parcelaId);
                    for (const m of dato.mediciones || []) {
                        if ((_h = m.variable) === null || _h === void 0 ? void 0 : _h.nombre_variable) {
                            fila[m.variable.nombre_variable] = this.parseNumerico(m.valor);
                        }
                    }
                }
                datosCampo.push(...parcelaMap.values());
                // 4. Obtener datos de cosecha
                const datosCosechaRaw = yield this.datosCosechaRepository
                    .createQueryBuilder('dc')
                    .leftJoinAndSelect('dc.parcela', 'p')
                    .leftJoinAndSelect('p.tratamiento', 't')
                    .leftJoinAndSelect('p.bloque', 'b')
                    .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
                    .getMany();
                console.log(`✅ Datos cosecha: ${datosCosechaRaw.length} registros`);
                // 5. Procesar datos de trilla
                const datosTrilla = datosCosechaRaw.map(c => {
                    var _a, _b, _c, _d, _e, _f;
                    return ({
                        tratamiento: ((_b = (_a = c.parcela) === null || _a === void 0 ? void 0 : _a.tratamiento) === null || _b === void 0 ? void 0 : _b.id) || 1,
                        bloque: ((_d = (_c = c.parcela) === null || _c === void 0 ? void 0 : _c.bloque) === null || _d === void 0 ? void 0 : _d.nombreBloque) || 'B',
                        parcela: ((_e = c.parcela) === null || _e === void 0 ? void 0 : _e.nombreParcela) || `P${(_f = c.parcela) === null || _f === void 0 ? void 0 : _f.id}`,
                        humedad: this.parseNumerico(c.humedadPct),
                        kgHa: this.parseNumerico(c.kgHaCorregido),
                        gje: this.parseNumerico(c.gie),
                    });
                });
                if (datosTrilla.length === 0 && ensayo.parcelas) {
                    datosTrilla.push(...ensayo.parcelas.map(p => {
                        var _a, _b;
                        return ({
                            tratamiento: ((_a = p.tratamiento) === null || _a === void 0 ? void 0 : _a.id) || 1,
                            bloque: ((_b = p.bloque) === null || _b === void 0 ? void 0 : _b.nombreBloque) || 'B',
                            parcela: p.nombreParcela || `P${p.id}`,
                            humedad: 0, kgHa: 0, gje: 0,
                        });
                    }));
                }
                // 6. Metadatos
                const metadadatos = {
                    ensayoId: ensayo.id,
                    nombreEnsayo: ensayo.nombreEnsayo || 'Sin nombre',
                    cultivo: ((_j = ensayo.cultivo) === null || _j === void 0 ? void 0 : _j.nombre) || 'N/A',
                    variedad: ((_k = ensayo.variedad) === null || _k === void 0 ? void 0 : _k.nombre) || 'N/A',
                    provincia: ensayo.provincia || 'N/A',
                    departamento: ensayo.departamento || 'N/A',
                    establecimiento: ensayo.establecimiento || 'N/A',
                    lote: ensayo.lote || 'N/A',
                    tipoSiembra: ((_l = ensayo.tipoSiembra) === null || _l === void 0 ? void 0 : _l.nombre) || 'N/A',
                    fechaSiembra: ensayo.fechaSiembra
                        ? new Date(ensayo.fechaSiembra).toLocaleDateString('es-ES')
                        : 'N/A',
                    fechaCosecha: ensayo.fechaCosecha
                        ? new Date(ensayo.fechaCosecha).toLocaleDateString('es-ES')
                        : 'N/A',
                    responsable: ((_m = ensayo.responsable) === null || _m === void 0 ? void 0 : _m.nombre) || 'N/A',
                    laboratorio: ((_o = ensayo.laboratorio) === null || _o === void 0 ? void 0 : _o.nombre) || 'N/A',
                    numeroTratamientos: [...new Set((ensayo.parcelas || []).map(p => { var _a; return (_a = p.tratamiento) === null || _a === void 0 ? void 0 : _a.id; }))].length,
                    numeroBloques: [...new Set((ensayo.parcelas || []).map(p => { var _a; return (_a = p.bloque) === null || _a === void 0 ? void 0 : _a.id; }))].length,
                };
                console.log(`✅ Completado: ${datosCampo.length} datos campo, ${datosTrilla.length} datos trilla`);
                return { ensayo, datosCampo, datosTrilla, metadadatos };
            }
            catch (error) {
                console.error(`❌ Error obtenerDatosEnsayo:`, error);
                throw error;
            }
        });
    }
    /**
     * Parsea un valor numérico desde CSV (maneja comas decimales)
     */
    parseNumerico(valor) {
        if (typeof valor === 'number')
            return valor;
        if (valor === undefined || valor === null || valor === '')
            return 0;
        const str = String(valor).trim();
        // Reemplazar coma por punto
        const numStr = str.replace(',', '.');
        const num = parseFloat(numStr);
        return isNaN(num) ? 0 : num;
    }
    /**
     * Calcula estadísticas por tratamiento
     */
    calcularEstadisticasPorTratamiento(datos, campo = 'kgHa') {
        const estadisticas = {};
        if (!datos || datos.length === 0) {
            return {
                T1: {
                    n: 0,
                    promedio: 0,
                    desviacion: 0,
                    minimo: 0,
                    maximo: 0,
                    coefVariacion: 0,
                },
            };
        }
        const tratamientos = [...new Set(datos.map(d => d.tratamiento))].sort();
        for (const trat of tratamientos) {
            const datosTrat = datos.filter(d => d.tratamiento === trat);
            const valores = datosTrat
                .map(d => this.parseNumerico(d[campo]))
                .filter(v => !isNaN(v) && v !== null);
            if (valores.length > 0) {
                estadisticas[`T${trat}`] = {
                    n: valores.length,
                    promedio: parseFloat(this.promedio(valores).toFixed(2)),
                    desviacion: parseFloat(this.desviacionEstandar(valores).toFixed(2)),
                    minimo: parseFloat(Math.min(...valores).toFixed(2)),
                    maximo: parseFloat(Math.max(...valores).toFixed(2)),
                    coefVariacion: parseFloat(this.coefVariacion(valores).toFixed(2)),
                };
            }
        }
        return estadisticas;
    }
    /**
     * Analiza la evolución de fitotoxicidad
     */
    analizarFitotoxicidad(datosCampo) {
        const ddasKeys = ['3DDA_FITO', '7DDA_FITO', '14DDA_FITO', '38DDA_FITO', '58DDA_FITO'];
        const ddas = ['3DDA', '7DDA', '14DDA', '38DDA', '58DDA'];
        const resultados = {};
        if (!datosCampo || datosCampo.length === 0) {
            return {};
        }
        const tratamientos = [...new Set(datosCampo.map(d => d.tratamiento))].sort();
        for (const trat of tratamientos) {
            resultados[`T${trat}`] = {};
            const datosTrat = datosCampo.filter(d => d.tratamiento === trat);
            for (let i = 0; i < ddasKeys.length; i++) {
                const dda = ddas[i];
                const valores = datosTrat
                    .map((d) => this.parseNumerico(d[ddasKeys[i]]))
                    .filter(v => !isNaN(v) && v !== null);
                if (valores.length > 0) {
                    resultados[`T${trat}`][dda] = {
                        promedio: parseFloat(this.promedio(valores).toFixed(2)),
                        max: parseFloat(Math.max(...valores).toFixed(2)),
                        min: parseFloat(Math.min(...valores).toFixed(2)),
                    };
                }
            }
        }
        return resultados;
    }
    /**
     * Analiza viabilidad y rendimiento
     */
    analizarRendimiento(datosTrilla) {
        const resultados = {};
        if (!datosTrilla || datosTrilla.length === 0) {
            return { T1: { promedio: 0, desviacion: 0, minimo: 0, maximo: 0, diferenciaTestigo: 0, porcentajeTestigo: 0, gjePromedio: 0 } };
        }
        const tratamientos = [...new Set(datosTrilla.map(d => d.tratamiento))].sort();
        // Identificar testigo (T1)
        const datosTestigo = datosTrilla.filter(d => d.tratamiento === 1);
        const kgHaTestigo = datosTestigo.map(d => this.parseNumerico(d.kgHa));
        const promTestigo = kgHaTestigo.length > 0 ? this.promedio(kgHaTestigo) : 0;
        for (const trat of tratamientos) {
            const datosTrat = datosTrilla.filter(d => d.tratamiento === trat);
            const kgHaValues = datosTrat.map(d => this.parseNumerico(d.kgHa));
            const gjeValues = datosTrat.map(d => this.parseNumerico(d.gje));
            const promTrat = kgHaValues.length > 0 ? this.promedio(kgHaValues) : 0;
            const porcentaje = promTestigo > 0 ? ((promTrat / promTestigo) * 100 - 100) : 0;
            resultados[`T${trat}`] = {
                promedio: parseFloat(promTrat.toFixed(1)),
                desviacion: parseFloat(this.desviacionEstandar(kgHaValues).toFixed(1)),
                minimo: kgHaValues.length > 0 ? parseFloat(Math.min(...kgHaValues).toFixed(1)) : 0,
                maximo: kgHaValues.length > 0 ? parseFloat(Math.max(...kgHaValues).toFixed(1)) : 0,
                diferenciaTestigo: parseFloat((promTrat - promTestigo).toFixed(1)),
                porcentajeTestigo: parseFloat(porcentaje.toFixed(1)),
                gjePromedio: gjeValues.length > 0 ? parseFloat(this.promedio(gjeValues).toFixed(1)) : 0,
            };
        }
        return resultados;
    }
    /**
     * Genera resumen ejecutivo con recomendaciones
     */
    generarResumenEjecutivo(datosCampo, datosTrilla, metadadosEnsayo) {
        var _a, _b;
        try {
            const rendimientos = this.analizarRendimiento(datosTrilla);
            const fitotoxicidad = this.analizarFitotoxicidad(datosCampo);
            // Encontrar mejor tratamiento (máximo rendimiento)
            let mejorTrat = 'T1';
            let maxRendimiento = -Infinity;
            for (const [trat, datos] of Object.entries(rendimientos)) {
                const rendimiento = (datos === null || datos === void 0 ? void 0 : datos.promedio) || 0;
                if (rendimiento > maxRendimiento) {
                    maxRendimiento = rendimiento;
                    mejorTrat = trat;
                }
            }
            // Validar que mejorTrat existe en rendimientos
            if (!rendimientos[mejorTrat]) {
                mejorTrat = 'T1';
            }
            // Evaluar fitotoxicidad del mejor tratamiento
            const fitoMejor = (((_a = fitotoxicidad[mejorTrat]) === null || _a === void 0 ? void 0 : _a['58DDA']) || {});
            const rendimientoMejor = rendimientos[mejorTrat] || { porcentajeTestigo: 0 };
            return {
                ensayo: (metadadosEnsayo === null || metadadosEnsayo === void 0 ? void 0 : metadadosEnsayo.ensayoId) || 'N/A',
                fechaReporte: new Date().toLocaleDateString('es-ES'),
                tratamientoRecomendado: mejorTrat,
                rendimientoMejor: (maxRendimiento >= 0 ? maxRendimiento : 0).toFixed(1),
                aumentoRendimiento: ((rendimientoMejor === null || rendimientoMejor === void 0 ? void 0 : rendimientoMejor.porcentajeTestigo) || 0).toFixed(1),
                fitotoxicidadMejor: ((_b = fitoMejor === null || fitoMejor === void 0 ? void 0 : fitoMejor.promedio) === null || _b === void 0 ? void 0 : _b.toFixed(1)) || '0',
                observaciones: this.generarObservaciones(mejorTrat, rendimientos, fitotoxicidad),
                recomendaciones: this.generarRecomendaciones(mejorTrat, rendimientos, fitotoxicidad),
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Error en generarResumenEjecutivo:', errorMessage);
            return {
                ensayo: (metadadosEnsayo === null || metadadosEnsayo === void 0 ? void 0 : metadadosEnsayo.ensayoId) || 'N/A',
                fechaReporte: new Date().toLocaleDateString('es-ES'),
                tratamientoRecomendado: 'T1',
                rendimientoMejor: '0',
                aumentoRendimiento: '0',
                fitotoxicidadMejor: '0',
                observaciones: ['Error al generar análisis'],
                recomendaciones: ['Se requieren más datos'],
            };
        }
    }
    /**
     * Genera PDF del reporte
     */
    generarPDF(datosCampo, datosTrilla, metadadatos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 Iniciando generación de PDF...');
                console.log(`   - Datos de campo: ${(datosCampo === null || datosCampo === void 0 ? void 0 : datosCampo.length) || 0} registros`);
                console.log(`   - Datos de trilla: ${(datosTrilla === null || datosTrilla === void 0 ? void 0 : datosTrilla.length) || 0} registros`);
                const estadisticas = this.calcularEstadisticasPorTratamiento(datosTrilla || [], 'kgHa');
                console.log(`   - Estadísticas calculadas: ${Object.keys(estadisticas).length} tratamientos`);
                const resumen = this.generarResumenEjecutivo(datosCampo || [], datosTrilla || [], metadadatos);
                console.log(`   - Resumen generado: ${resumen.tratamientoRecomendado}`);
                const pdfData = {
                    metadatos: metadadatos,
                    datosCampo: datosCampo || [],
                    datosTrilla: datosTrilla || [],
                    estadisticas,
                    resumen,
                };
                console.log('   - Llamando a PdfReportGenerator...');
                const buffer = yield pdf_generator_1.PdfReportGenerator.generarReporteEnsayo(pdfData);
                console.log(`   ✅ PDF generado exitosamente: ${buffer.length} bytes`);
                return buffer;
            }
            catch (error) {
                console.error('❌ Error generando PDF:', error);
                throw error;
            }
        });
    }
    /**
     * Genera Excel del reporte
     */
    generarExcel(datosCampo, datosTrilla, metadadatos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('🔄 Iniciando generación de Excel...');
                console.log(`   - Datos de campo: ${(datosCampo === null || datosCampo === void 0 ? void 0 : datosCampo.length) || 0} registros`);
                console.log(`   - Datos de trilla: ${(datosTrilla === null || datosTrilla === void 0 ? void 0 : datosTrilla.length) || 0} registros`);
                const estadisticas = this.calcularEstadisticasPorTratamiento(datosTrilla || [], 'kgHa');
                console.log(`   - Estadísticas calculadas: ${Object.keys(estadisticas).length} tratamientos`);
                const excelData = {
                    metadatos: metadadatos,
                    datosCampo: datosCampo || [],
                    datosTrilla: datosTrilla || [],
                    estadisticas,
                };
                console.log('   - Llamando a ExcelReportGenerator...');
                const buffer = yield excel_generator_1.ExcelReportGenerator.generarReporteEnsayo(excelData);
                console.log(`   ✅ Excel generado exitosamente: ${buffer.length} bytes`);
                return buffer;
            }
            catch (error) {
                console.error('❌ Error generando Excel:', error);
                throw error;
            }
        });
    }
    // ============ FUNCIONES MATEMÁTICAS ============
    promedio(valores) {
        if (valores.length === 0)
            return 0;
        return valores.reduce((a, b) => a + b, 0) / valores.length;
    }
    desviacionEstandar(valores) {
        if (valores.length === 0)
            return 0;
        const prom = this.promedio(valores);
        const varianza = valores.reduce((a, b) => a + Math.pow(b - prom, 2), 0) / valores.length;
        return Math.sqrt(varianza);
    }
    coefVariacion(valores) {
        if (valores.length === 0)
            return 0;
        const prom = this.promedio(valores);
        if (prom === 0)
            return 0;
        const desv = this.desviacionEstandar(valores);
        return (desv / prom) * 100;
    }
    generarObservaciones(mejorTrat, rendimientos, fitotoxicidad) {
        var _a, _b;
        const obs = [];
        try {
            const tratData = rendimientos[mejorTrat];
            if (!tratData) {
                return ['No hay datos disponibles'];
            }
            const rendMejor = (tratData === null || tratData === void 0 ? void 0 : tratData.porcentajeTestigo) || 0;
            if (rendMejor > 10) {
                obs.push(`${mejorTrat} superó al testigo en ${rendMejor}%`);
            }
            else if (rendMejor > 0) {
                obs.push(`${mejorTrat} mostró ligera mejora`);
            }
            else {
                obs.push(`${mejorTrat} rendimiento similar al testigo`);
            }
            const fitoMejor = (((_b = (_a = fitotoxicidad[mejorTrat]) === null || _a === void 0 ? void 0 : _a['58DDA']) === null || _b === void 0 ? void 0 : _b.promedio) || 0);
            if (fitoMejor === 0) {
                obs.push(`${mejorTrat} sin fitotoxicidad`);
            }
            else if (fitoMejor <= 2) {
                obs.push(`${mejorTrat} fitotoxicidad baja`);
            }
            else {
                obs.push(`${mejorTrat} fitotoxicidad moderada`);
            }
        }
        catch (error) {
            obs.push('Error al generar observaciones');
        }
        return obs.length > 0 ? obs : ['Sin observaciones'];
    }
    generarRecomendaciones(mejorTrat, rendimientos, fitotoxicidad) {
        var _a, _b;
        const recomendaciones = [];
        try {
            const tratData = rendimientos[mejorTrat];
            if (!tratData) {
                return ['Se requieren más datos'];
            }
            const fitoMejor = (((_b = (_a = fitotoxicidad[mejorTrat]) === null || _a === void 0 ? void 0 : _a['58DDA']) === null || _b === void 0 ? void 0 : _b.promedio) || 0);
            const rendMejor = (tratData === null || tratData === void 0 ? void 0 : tratData.porcentajeTestigo) || 0;
            if (rendMejor > 5 && fitoMejor <= 1) {
                recomendaciones.push(`Usar ${mejorTrat} en condiciones similares`);
            }
            else if (rendMejor > 0 && fitoMejor <= 2) {
                recomendaciones.push(`${mejorTrat} recomendado con precaución`);
            }
            else {
                recomendaciones.push(`Evaluar más ensayos antes de adoptar`);
            }
            if (fitoMejor > 3) {
                recomendaciones.push(`Evaluar en estadíos más avanzados`);
            }
        }
        catch (error) {
            recomendaciones.push('Error al generar recomendaciones');
        }
        return recomendaciones.length > 0
            ? recomendaciones
            : ['Sin recomendaciones'];
    }
};
exports.ReportesService = ReportesService;
exports.ReportesService = ReportesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ensayo_entity_1.Ensayo)),
    __param(1, (0, typeorm_1.InjectRepository)(parcela_entity_1.Parcela)),
    __param(2, (0, typeorm_1.InjectRepository)(datos_campo_entity_1.DatosCampo)),
    __param(3, (0, typeorm_1.InjectRepository)(datos_campo_medicion_entity_1.DatosCampoMedicion)),
    __param(4, (0, typeorm_1.InjectRepository)(datos_cosecha_entity_1.DatosCosecha)),
    __param(5, (0, typeorm_1.InjectRepository)(tratamiento_entity_1.Tratamiento)),
    __param(6, (0, typeorm_1.InjectRepository)(bloque_entity_1.Bloque)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportesService);
