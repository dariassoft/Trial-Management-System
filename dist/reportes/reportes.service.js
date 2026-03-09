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
let ReportesService = class ReportesService {
    constructor(ensayoRepository, parcelaRepository, datosCampoRepository, datosCampoMedicionRepository, datosCosechaRepository, tratamientoRepository, bloqueRepository, aplicacionRepository, 
    // NUEVOS SERVICIOS
    calculosService, reportesEspecializadosService) {
        this.ensayoRepository = ensayoRepository;
        this.parcelaRepository = parcelaRepository;
        this.datosCampoRepository = datosCampoRepository;
        this.datosCampoMedicionRepository = datosCampoMedicionRepository;
        this.datosCosechaRepository = datosCosechaRepository;
        this.tratamientoRepository = tratamientoRepository;
        this.bloqueRepository = bloqueRepository;
        this.aplicacionRepository = aplicacionRepository;
        this.calculosService = calculosService;
        this.reportesEspecializadosService = reportesEspecializadosService;
    }
    /**
     * Obtiene todos los datos de un ensayo desde la BD
     */
    obtenerDatosEnsayo(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            try {
                console.log(`📥 Obteniendo datos para ensayo ${ensayoId}...`);
                // 1. Obtener ensayo base CON TODAS LAS RELACIONES
                const ensayo = yield this.ensayoRepository.findOne({
                    where: { id: ensayoId },
                    relations: [
                        'laboratorio',
                        'cultivo', // ← IMPORTANTE: Cargar relación cultivo
                        'variedad', // ← IMPORTANTE: Cargar relación variedad
                        'tipoSiembra', // ← IMPORTANTE: Cargar relación tipoSiembra
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
                console.log(`   Cultivo: ${((_b = ensayo.cultivo) === null || _b === void 0 ? void 0 : _b.nombre) || 'NO CARGADO'}`);
                console.log(`   TipoSiembra: ${((_c = ensayo.tipoSiembra) === null || _c === void 0 ? void 0 : _c.nombre) || 'NO CARGADO'}`);
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
                    const parcelaId = ((_d = dato.parcela) === null || _d === void 0 ? void 0 : _d.id) || 0;
                    if (!parcelaMap.has(parcelaId)) {
                        parcelaMap.set(parcelaId, {
                            tratamiento: ((_f = (_e = dato.parcela) === null || _e === void 0 ? void 0 : _e.tratamiento) === null || _f === void 0 ? void 0 : _f.id) || 1,
                            bloque: ((_h = (_g = dato.parcela) === null || _g === void 0 ? void 0 : _g.bloque) === null || _h === void 0 ? void 0 : _h.nombreBloque) || 'B',
                            parcela: ((_j = dato.parcela) === null || _j === void 0 ? void 0 : _j.nombreParcela) || `P${parcelaId}`,
                        });
                    }
                    const fila = parcelaMap.get(parcelaId);
                    for (const m of dato.mediciones || []) {
                        if (((_k = m.variable) === null || _k === void 0 ? void 0 : _k.nombre_variable) && fila) {
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
                // OBTENER DATOS DE APLICACION PARA EL ENSAYO
                const aplicacion = yield this.aplicacionRepository
                    .createQueryBuilder('a')
                    .where('a.ensayo_id_fk = :ensayoId', { ensayoId })
                    .orderBy('a.aplicacion_id', 'ASC')
                    .getOne();
                console.log(`✅ Aplicación: ${aplicacion ? 'Encontrada' : 'No encontrada'}`);
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
                // 6. Metadatos - USAR VALORES DIRECTAMENTE DE ENSAYO QUE YA TIENE RELACIONES CARGADAS
                const metadadatos = {
                    ensayoId: ensayo.id,
                    nombreEnsayo: ensayo.nombreEnsayo || 'Sin nombre',
                    cultivo: ((_l = ensayo.cultivo) === null || _l === void 0 ? void 0 : _l.nombre) || 'N/A',
                    variedad: ((_m = ensayo.variedad) === null || _m === void 0 ? void 0 : _m.nombre) || 'N/A',
                    provincia: ensayo.provincia || 'N/A',
                    departamento: ensayo.departamento || 'N/A',
                    establecimiento: ensayo.establecimiento || 'N/A',
                    lote: ensayo.lote || 'N/A',
                    tipoSiembra: ((_o = ensayo.tipoSiembra) === null || _o === void 0 ? void 0 : _o.nombre) || 'N/A',
                    fechaSiembra: ensayo.fechaSiembra
                        ? new Date(ensayo.fechaSiembra).toLocaleDateString('es-ES')
                        : 'N/A',
                    fechaCosecha: ensayo.fechaCosecha
                        ? new Date(ensayo.fechaCosecha).toLocaleDateString('es-ES')
                        : 'N/A',
                    // DATOS DE APLICACION
                    fechaAplicacion: (aplicacion === null || aplicacion === void 0 ? void 0 : aplicacion.fechaHora)
                        ? new Date(aplicacion.fechaHora).toLocaleDateString('es-ES')
                        : 'N/A',
                    estadio: (aplicacion === null || aplicacion === void 0 ? void 0 : aplicacion.estadioCultivo) || 'N/A',
                    temperatura: (aplicacion === null || aplicacion === void 0 ? void 0 : aplicacion.tempC) ? `${aplicacion.tempC}°C` : 'N/A',
                    humedad: (aplicacion === null || aplicacion === void 0 ? void 0 : aplicacion.humedadPct) ? `${aplicacion.humedadPct}%` : 'N/A',
                    equipo: (aplicacion === null || aplicacion === void 0 ? void 0 : aplicacion.equipoInfo) || 'N/A',
                    responsable: ((_p = ensayo.responsable) === null || _p === void 0 ? void 0 : _p.nombre) || 'N/A',
                    laboratorio: ((_q = ensayo.laboratorio) === null || _q === void 0 ? void 0 : _q.nombre) || 'N/A',
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
     * NUEVO MÉTODO: Obtiene datos del ensayo usando SQL nativo con nombres EXACTOS
     */
    obtenerDatosEnsayoRaw(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const manager = this.ensayoRepository.manager;
                // 1. ENSAYO COMPLETO
                const ensayoRaw = yield manager.query(`
        SELECT e.*, c.nombre as cultivo_nombre, ts.nombre as tipo_siembra_nombre
        FROM Ensayo e
        LEFT JOIN Cultivo c ON e.cultivo_id = c.cultivo_id
        LEFT JOIN TipoSiembra ts ON e.tipo_siembra_id = ts.id
        WHERE e.ensayo_id = ?
      `, [ensayoId]);
                if (!ensayoRaw.length)
                    return null;
                const ensayo = ensayoRaw[0];
                // 2. APLICACION COMPLETA
                const aplicacionRaw = yield manager.query(`
        SELECT * FROM Aplicacion WHERE ensayo_id_fk = ? LIMIT 1
      `, [ensayoId]);
                const aplicacion = aplicacionRaw.length ? aplicacionRaw[0] : {};
                // 3. DATOS COSECHA TODOS LOS CAMPOS
                const datosTrilla = yield manager.query(`
        SELECT 
          p.nombre_parcela, t.numero_trat, b.nombre_bloque,
          dc.humedad_pct, dc.kg_ha_corregido, dc.gie, dc.gramaje_por_grano,
          dc.granos_porurf, dc.peso_granos_porurf, dc.granos_danados,
          dc.granos_verdes, dc.granos_vanos, dc.hojas_porurf,
          dc.larvas_porurf, dc.insectos_beneficios_porurf,
          dc.diametro_espiga, dc.altura_parcela, dc.densidad_plantas_final
        FROM Datos_Cosecha dc
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        INNER JOIN Bloque b ON p.bloque_id_fk = b.bloque_id
        WHERE p.ensayo_id_fk = ?
      `, [ensayoId]);
                // 4. DATOS CAMPO CON VARIABLES - COMPLETO CON MOMENTO INFO
                const datosCampoRaw = yield manager.query(`
        SELECT 
          dc.dato_campo_id, p.nombre_parcela, t.numero_trat, b.nombre_bloque,
          me.nombre_momento, me.dias_despues_aplicacion, me.fecha_evaluacion,
          pv.nombre_variable, dcm.valor
        FROM Datos_Campo dc
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        INNER JOIN Bloque b ON p.bloque_id_fk = b.bloque_id
        INNER JOIN Momento_Evaluacion me ON dc.momento_id_fk = me.momento_id
        LEFT JOIN Datos_Campo_Medicion dcm ON dc.dato_campo_id = dcm.dato_campo_id_fk
        LEFT JOIN Protocolo_Variable pv ON dcm.variable_id_fk = pv.variable_id
        WHERE p.ensayo_id_fk = ?
      `, [ensayoId]);
                // 5. FOTOS Y ARCHIVOS
                const fotosRaw = yield manager.query(`
        SELECT 
          fr.foto_id, fr.file_name, fr.file_path, fr.mime_type, fr.fecha_subida,
          p.nombre_parcela, t.numero_trat, b.nombre_bloque
        FROM Foto_Registro fr
        INNER JOIN Datos_Campo dc ON fr.dato_campo_id_fk = dc.dato_campo_id
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        INNER JOIN Bloque b ON p.bloque_id_fk = b.bloque_id
        WHERE p.ensayo_id_fk = ?
      `, [ensayoId]);
                // 6. ESTADÍSTICAS
                const estadisticasRaw = yield manager.query(`
        SELECT
          t.numero_trat,
          COUNT(*) as n,
          ROUND(AVG(dc.kg_ha_corregido), 2) as promedio,
          ROUND(STDDEV(dc.kg_ha_corregido), 2) as desviacion,
          ROUND(MIN(dc.kg_ha_corregido), 2) as minimo,
          ROUND(MAX(dc.kg_ha_corregido), 2) as maximo,
          ROUND(AVG(dc.gie), 2) as gie,
          ROUND(AVG(dc.larvas_porurf), 2) as larvas_porurf,
          ROUND(AVG(dc.insectos_beneficios_porurf), 2) as insectos_beneficios_porurf
        FROM Datos_Cosecha dc
        INNER JOIN Parcela p ON dc.parcela_id_fk = p.parcela_id
        INNER JOIN Tratamiento t ON p.tratamiento_id_fk = t.tratamiento_id
        WHERE p.ensayo_id_fk = ?
        GROUP BY t.numero_trat
      `, [ensayoId]);
                // Convertir estadísticas a map
                const estadisticas = {};
                for (const stat of estadisticasRaw) {
                    const s = stat;
                    estadisticas[`T${s.numero_trat}`] = {
                        n: s.n,
                        promedio: s.promedio,
                        desviacion: s.desviacion,
                        minimo: s.minimo,
                        maximo: s.maximo,
                        gie: s.gie,
                        larvas_porurf: s.larvas_porurf || 0,
                        insectos_beneficios_porurf: s.insectos_beneficios_porurf || 0,
                    };
                }
                // PROCESAR DATOS COSECHA - SIN undefined
                const datosTrillaProcessed = datosTrilla.map((dt) => ({
                    parcela: dt.nombre_parcela,
                    tratamiento: dt.numero_trat,
                    bloque: dt.nombre_bloque,
                    humedad: dt.humedad_pct !== null ? `${dt.humedad_pct}%` : '',
                    kgHa: dt.kg_ha_corregido !== null ? `${Math.round(dt.kg_ha_corregido)}` : '',
                    gie: dt.gie !== null ? `${parseFloat(dt.gie).toFixed(1)}%` : '',
                    gramaje: dt.gramaje_por_grano !== null ? `${dt.gramaje_por_grano}` : '',
                    granosUrf: dt.granos_porurf !== null ? `${Math.round(dt.granos_porurf)}` : '',
                    pesoGranos: dt.peso_granos_porurf !== null ? `${dt.peso_granos_porurf}` : '',
                    dañados: dt.granos_danados !== null ? `${dt.granos_danados}%` : '',
                    verdes: dt.granos_verdes !== null ? `${dt.granos_verdes}%` : '',
                    vanos: dt.granos_vanos !== null ? `${dt.granos_vanos}%` : '',
                    hojas: dt.hojas_porurf !== null ? `${Math.round(dt.hojas_porurf)}` : '',
                    larvas: dt.larvas_porurf !== null ? `${dt.larvas_porurf}` : '',
                    beneficos: dt.insectos_beneficios_porurf !== null ? `${dt.insectos_beneficios_porurf}` : '',
                    diametro: dt.diametro_espiga !== null ? `${dt.diametro_espiga}mm` : '',
                    altura: dt.altura_parcela !== null ? `${dt.altura_parcela}cm` : '',
                    densidad: dt.densidad_plantas_final !== null ? `${dt.densidad_plantas_final}` : '',
                }));
                // PROCESAR DATOS CAMPO - SIN undefined
                const datosCampoProcessed = datosCampoRaw.map((dc) => ({
                    parcela: dc.nombre_parcela,
                    tratamiento: dc.numero_trat,
                    bloque: dc.nombre_bloque,
                    momento: dc.nombre_momento,
                    variable: dc.nombre_variable,
                    valor: dc.valor !== null ? `${parseFloat(dc.valor).toFixed(1)}` : '',
                }));
                // PROCESAR FOTOS - SIN undefined
                const fotosProcessed = fotosRaw.map((f) => ({
                    id: f.foto_id,
                    nombre: f.file_name,
                    ruta: f.file_path,
                    tipo: f.mime_type,
                    fecha: f.fecha_subida ? new Date(f.fecha_subida).toLocaleDateString('es-ES') : '',
                    parcela: f.nombre_parcela,
                    tratamiento: f.numero_trat,
                    bloque: f.nombre_bloque,
                }));
                // METADADATOS - SIN N/A - CON UTF-8 LIMPIO
                const metadadatos = {
                    ensayoId: ensayo.ensayo_id,
                    nombreEnsayo: this.limpiarUTF8(ensayo.nombre_ensayo || ''),
                    cultivo: this.limpiarUTF8(ensayo.cultivo_nombre || ''),
                    tipoSiembra: this.limpiarUTF8(ensayo.tipo_siembra_nombre || ''),
                    provincia: this.limpiarUTF8(ensayo.provincia || ''),
                    departamento: this.limpiarUTF8(ensayo.departamento || ''),
                    establecimiento: this.limpiarUTF8(ensayo.establecimiento || ''),
                    lote: this.limpiarUTF8(ensayo.lote || ''),
                    fechaSiembra: ensayo.fecha_siembra ? new Date(ensayo.fecha_siembra).toLocaleDateString('es-ES') : '',
                    fechaCosecha: ensayo.fecha_cosecha ? new Date(ensayo.fecha_cosecha).toLocaleDateString('es-ES') : '',
                    // APLICACION
                    fechaAplicacion: aplicacion.fecha_hora ? new Date(aplicacion.fecha_hora).toLocaleDateString('es-ES') : '',
                    estadio: this.limpiarUTF8(aplicacion.estadio_cultivo || ''),
                    temperatura: aplicacion.temp_c ? `${aplicacion.temp_c}°C` : '',
                    humedad: aplicacion.humedad_pct ? `${aplicacion.humedad_pct}%` : '',
                    equipo: this.limpiarUTF8(aplicacion.equipo_info || ''),
                    viento: aplicacion.viento_kmh ? `${aplicacion.viento_kmh}` : '',
                    pico: this.limpiarUTF8(aplicacion.pico_info || ''),
                    presion: aplicacion.presion_bar ? `${aplicacion.presion_bar}` : '',
                };
                // 7. CONSTRUIR EVALUACIONES DESDE DATOS YA CARGADOS EN datosCampoRaw
                console.log(`🔍 datosCampoRaw.length = ${datosCampoRaw.length}`);
                if (datosCampoRaw.length > 0) {
                    console.log(`🔍 Primer registro datosCampoRaw:`, JSON.stringify(datosCampoRaw[0]));
                }
                // Agrupar por momento y recolectar variables
                const momentosPorNombre = new Map();
                for (const dc of datosCampoRaw) {
                    if (!dc.nombre_momento)
                        continue;
                    if (!momentosPorNombre.has(dc.nombre_momento)) {
                        momentosPorNombre.set(dc.nombre_momento, {
                            dds: dc.dias_despues_aplicacion || 0,
                            fecha: dc.fecha_evaluacion,
                            variables: new Set(),
                        });
                    }
                    if (dc.nombre_variable) {
                        momentosPorNombre.get(dc.nombre_momento).variables.add(dc.nombre_variable);
                    }
                }
                console.log(`🔍 Momentos encontrados: ${momentosPorNombre.size}`);
                // Construir evaluacionesFechas - LLENO DE DATOS
                const evaluacionesFechas = Array.from(momentosPorNombre.entries())
                    .sort((a, b) => (a[1].dds || 0) - (b[1].dds || 0))
                    .map(([nombre, data]) => [
                    String(data.dds || ''),
                    data.fecha ? new Date(data.fecha).toLocaleDateString('es-ES') : '',
                    Array.from(data.variables).join(', ') || 'Sin variables',
                ]);
                console.log(`✅ evaluacionesFechas: ${JSON.stringify(evaluacionesFechas)}`);
                // 8. CONSTRUIR EVALUACIONES DETALLE DESDE datosCampoRaw
                // Obtener tratamientos únicos de parcelas del ensayo
                const parcelasTratamientos = yield this.parcelaRepository
                    .createQueryBuilder('p')
                    .leftJoinAndSelect('p.tratamiento', 't')
                    .leftJoinAndSelect('p.bloque', 'b')
                    .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
                    .getMany();
                // Extraer únicos
                const tratamientosUnicos = new Map();
                for (const p of parcelasTratamientos) {
                    const key = `T${(_a = p.tratamiento) === null || _a === void 0 ? void 0 : _a.numeroTrat}_B${(_b = p.bloque) === null || _b === void 0 ? void 0 : _b.nombreBloque}`;
                    if (!tratamientosUnicos.has(key)) {
                        tratamientosUnicos.set(key, {
                            tratamiento: String(((_c = p.tratamiento) === null || _c === void 0 ? void 0 : _c.numeroTrat) || ''),
                            bloque: ((_d = p.bloque) === null || _d === void 0 ? void 0 : _d.nombreBloque) || '',
                        });
                    }
                }
                console.log(`🔍 Tratamientos únicos: ${tratamientosUnicos.size}`);
                // Ordenar momentos por DDS
                const momentosOrdenados = Array.from(momentosPorNombre.entries())
                    .sort((a, b) => (a[1].dds || 0) - (b[1].dds || 0));
                // Construir header dinámico basado en momentos - MÁS DESCRIPTIVO
                const headerEvaluaciones = ['Trat', 'Bloque'];
                for (const [nombre, momento] of momentosOrdenados) {
                    const dds = momento.dds;
                    const fecha = momento.fecha ? new Date(momento.fecha).toLocaleDateString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit' }) : 'N/A';
                    headerEvaluaciones.push(`Valor (${dds} DDS)`);
                    headerEvaluaciones.push(`Fecha ${fecha}`);
                    headerEvaluaciones.push(`Variable`);
                }
                headerEvaluaciones.push('Nº Var');
                console.log(`🔍 headerEvaluaciones: ${JSON.stringify(headerEvaluaciones)}`);
                // Construir filas de evaluaciones detalle - LLENAR CON DATOS REALES DE datosCampoRaw
                const evaluacionesDetalle = [];
                for (const [tratKey, tratData] of tratamientosUnicos.entries()) {
                    const filaMediciones = [
                        tratData.tratamiento,
                        tratData.bloque,
                    ];
                    let contadorVariables = 0;
                    // Para cada momento, buscar los valores en datosCampoRaw
                    for (const [nombreMomento, momentoData] of momentosOrdenados) {
                        let valorMomento = '';
                        let fechaMomento = '';
                        let variableMomento = '';
                        // Buscar en datosCampoRaw - TODOS LOS REGISTROS PARA ESTA COMBINACION
                        for (const dcRaw of datosCampoRaw) {
                            const dc = dcRaw;
                            // Coincidir tratamiento, bloque y momento
                            if (String(dc.numero_trat) !== tratData.tratamiento)
                                continue;
                            if (dc.nombre_bloque !== tratData.bloque)
                                continue;
                            if (dc.nombre_momento !== nombreMomento)
                                continue;
                            // Encontrado - llenar datos
                            valorMomento = dc.valor ? String(dc.valor) : '';
                            variableMomento = dc.nombre_variable || '';
                            fechaMomento = dc.fecha_evaluacion
                                ? new Date(dc.fecha_evaluacion).toLocaleDateString('es-ES')
                                : '';
                            contadorVariables++;
                            break;
                        }
                        filaMediciones.push(valorMomento);
                        filaMediciones.push(fechaMomento);
                        filaMediciones.push(variableMomento);
                    }
                    filaMediciones.push(String(contadorVariables));
                    evaluacionesDetalle.push(filaMediciones);
                }
                console.log(`🔍 evaluacionesDetalle.length: ${evaluacionesDetalle.length}`);
                if (evaluacionesDetalle.length > 0) {
                    console.log(`🔍 evaluacionesDetalle[0]:`, JSON.stringify(evaluacionesDetalle[0]));
                }
                console.log(`✅ Evaluaciones: ${evaluacionesFechas.length} fechas, ${evaluacionesDetalle.length} detalles`);
                console.log(`✅ Datos obtenidos: ${datosTrillaProcessed.length} cosecha, ${datosCampoProcessed.length} campo, ${fotosProcessed.length} fotos`);
                // Obtener protocolo y diseño desde BD
                const protocolo = ensayo.protocolo ? {
                    id: ensayo.protocolo.protocolo_id,
                    descripcion: ensayo.protocolo.descripcion || 'Sin descripción',
                } : { descripcion: 'Sin protocolo definido' };
                const diseno = {
                    nombre: ensayo.nombreEnsayo || 'No especificado',
                    // Obtener cantidad real de bloques desde parcelas únicas
                    repeticiones: new Set((_e = ensayo.parcelas) === null || _e === void 0 ? void 0 : _e.map((p) => { var _a; return (_a = p.bloque) === null || _a === void 0 ? void 0 : _a.bloque_id; })).size || 0,
                    // Obtener cantidad real de tratamientos
                    tratamientos: new Set((_f = ensayo.parcelas) === null || _f === void 0 ? void 0 : _f.map((p) => { var _a; return (_a = p.tratamiento) === null || _a === void 0 ? void 0 : _a.tratamiento_id; })).size || 0,
                };
                return {
                    datosCampo: datosCampoProcessed,
                    datosTrilla: datosTrillaProcessed,
                    metadadatos,
                    fotos: fotosProcessed,
                    estadisticas,
                    evaluacionesFechas,
                    evaluacionesDetalle,
                    headerEvaluaciones,
                    protocolo,
                    diseno,
                };
            }
            catch (error) {
                console.error(`❌ Error obtenerDatosEnsayoRaw:`, error);
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
     * Genera PDF del reporte - AHORA USA obtenerDatosEnsayoRaw
     */
    generarPDFEnsayo(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log(`🔄 Generando PDF para ensayo ${ensayoId}...`);
                // USAR obtenerDatosEnsayoRaw que trae TODOS los campos incluyendo larvas_porurf
                const datosRaw = yield this.obtenerDatosEnsayoRaw(ensayoId);
                if (!datosRaw) {
                    throw new Error(`Ensayo ${ensayoId} no encontrado`);
                }
                console.log(`   - Datos de campo: ${((_a = datosRaw.datosCampo) === null || _a === void 0 ? void 0 : _a.length) || 0} registros`);
                console.log(`   - Datos de trilla: ${((_b = datosRaw.datosTrilla) === null || _b === void 0 ? void 0 : _b.length) || 0} registros`);
                console.log(`   - Estadísticas: ${Object.keys(datosRaw.estadisticas).length} tratamientos`);
                // DEBUG: Verificar que larvas_porurf está en estadísticas
                for (const [trat, stats] of Object.entries(datosRaw.estadisticas)) {
                    console.log(`   ${trat}: larvas=${stats.larvas_porurf}, beneficos=${stats.insectos_beneficios_porurf}`);
                }
                const resumen = this.generarResumenEjecutivo(datosRaw.datosCampo || [], datosRaw.datosTrilla || [], datosRaw.metadadatos);
                const pdfData = {
                    metadatos: datosRaw.metadadatos,
                    datosCampo: datosRaw.datosCampo || [],
                    datosTrilla: datosRaw.datosTrilla || [],
                    estadisticas: datosRaw.estadisticas,
                    resumen,
                    fotos: datosRaw.fotos || [],
                    evaluacionesFechas: datosRaw.evaluacionesFechas || [],
                    evaluacionesDetalle: datosRaw.evaluacionesDetalle || [],
                    headerEvaluaciones: datosRaw.headerEvaluaciones || [],
                };
                console.log('   - Llamando a PdfReportGenerator...');
                const buffer = yield pdf_generator_1.PdfReportGenerator.generarReporteEnsayo(pdfData);
                console.log(`   ✅ PDF generado: ${buffer.length} bytes`);
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
    /**
     * NUEVO: Genera reporte completo con todos los servicios integrados
     * Incluye validación, cálculos, 6 reportes especializados y gráficos
     */
    generarReporteCompleto(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log(`📊 Generando reporte completo para ensayo ${ensayoId}`);
                // 1. Obtener datos
                const { ensayo, datosCampo, datosTrilla, metadadatos } = yield this.obtenerDatosEnsayo(ensayoId);
                if (!ensayo) {
                    throw new Error(`Ensayo ${ensayoId} no encontrado`);
                }
                // 2. Validar coherencia de datos
                const validacionGlobal = {
                    advertencias: [],
                    errores: [],
                };
                for (const dato of datosTrilla) {
                    const validacion = this.calculosService.validarCoherenciaDatos(dato);
                    validacionGlobal.advertencias.push(...validacion.advertencias);
                    validacionGlobal.errores.push(...validacion.errores);
                }
                console.log(`✅ Validación: ${validacionGlobal.advertencias.length} advertencias, ${validacionGlobal.errores.length} errores`);
                // 3. Generar 6 reportes especializados
                const reportes = {
                    rendimiento: this.reportesEspecializadosService.generarReporteRendimiento({
                        datosTrilla,
                        datosCampo,
                    }),
                    sanidad: this.reportesEspecializadosService.generarReporteSanidad({
                        datosTrilla,
                    }),
                    desarrollo: this.reportesEspecializadosService.generarReporteDesarrollo({
                        datosTrilla,
                    }),
                    composicion: this.reportesEspecializadosService.generarReporteComposicion({
                        datosTrilla,
                    }),
                    eficiencia: this.reportesEspecializadosService.generarReporteEficiencia({
                        datosTrilla,
                    }),
                    resumen: this.reportesEspecializadosService.generarResumenEjecutivo({
                        datosTrilla,
                        metadadatos,
                    }),
                };
                console.log(`✅ Reportes generados: ${Object.keys(reportes).length} tipos`);
                // 4. Generar gráficos SVG (básico)
                const graficos = {
                    rendimiento: svg_charts_service_1.SvgChartsService.generarGraficoBarras(((_a = reportes.rendimiento.graficos) === null || _a === void 0 ? void 0 : _a.barras) || [], { titulo: 'Rendimiento por Tratamiento', ancho: 800, alto: 500 }),
                };
                console.log(`✅ Gráficos generados`);
                // 5. Retornar estructura completa
                return {
                    ensayo,
                    metadadatos,
                    datosCampo,
                    datosTrilla,
                    reportes,
                    graficos,
                    validacion: validacionGlobal,
                };
            }
            catch (error) {
                console.error('❌ Error generando reporte completo:', error);
                throw error;
            }
        });
    }
    /**
     * Limpia caracteres especiales UTF-8 problemáticos
     */
    limpiarUTF8(texto) {
        if (!texto)
            return '';
        return texto
            .replace(/Ã¡/g, 'á')
            .replace(/Ã©/g, 'é')
            .replace(/Ã­/g, 'í')
            .replace(/Ã³/g, 'ó')
            .replace(/Ãº/g, 'ú')
            .replace(/Ã±/g, 'ñ')
            .replace(/Â/g, '')
            .replace(/Ã/g, '')
            .trim();
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
    __param(7, (0, typeorm_1.InjectRepository)(aplicacion_entity_1.Aplicacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        calculos_reportes_service_1.CalculosReportesService,
        reportes_especializados_service_1.ReportesEspecializadosService])
], ReportesService);
