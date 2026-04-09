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
exports.AsistenteFlujoService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rol_entity_1 = require("../entities/rol.entity");
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
let AsistenteFlujoService = class AsistenteFlujoService {
    constructor(req, ensayoRepo, bloqueRepo, parcelaRepo, datosCampoRepo, datosSiembraRepo, datosCosechaRepo, protocoloRepo, tratamientoRepo, tratProdRepo, labRepo, productoRepo, tipoEnsayoRepo, tipoVarRepo, tipoDiaRepo, protoVarRepo, aplicacionRepo, momentoRepo) {
        this.req = req;
        this.ensayoRepo = ensayoRepo;
        this.bloqueRepo = bloqueRepo;
        this.parcelaRepo = parcelaRepo;
        this.datosCampoRepo = datosCampoRepo;
        this.datosSiembraRepo = datosSiembraRepo;
        this.datosCosechaRepo = datosCosechaRepo;
        this.protocoloRepo = protocoloRepo;
        this.tratamientoRepo = tratamientoRepo;
        this.tratProdRepo = tratProdRepo;
        this.labRepo = labRepo;
        this.productoRepo = productoRepo;
        this.tipoEnsayoRepo = tipoEnsayoRepo;
        this.tipoVarRepo = tipoVarRepo;
        this.tipoDiaRepo = tipoDiaRepo;
        this.protoVarRepo = protoVarRepo;
        this.aplicacionRepo = aplicacionRepo;
        this.momentoRepo = momentoRepo;
    }
    get auth() {
        var _a;
        const user = (_a = this.req) === null || _a === void 0 ? void 0 : _a.user;
        const isInvitado = (user === null || user === void 0 ? void 0 : user.rol) === rol_entity_1.Role.INVITADO;
        const labIds = ((user === null || user === void 0 ? void 0 : user.lab_ids) || []);
        return { isInvitado, labIds };
    }
    /**
     * Obtiene el estado completo de flujo de trabajo de un ensayo existente
     */
    getEstado(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Cargar ensayo con relaciones
            const ensayo = yield this.ensayoRepo.findOne({
                where: { id: ensayoId },
                relations: ['laboratorio', 'tipoEnsayo', 'protocolo', 'cultivo', 'variedad', 'status'],
            });
            if (!ensayo) {
                throw new common_1.NotFoundException(`Ensayo #${ensayoId} no encontrado`);
            }
            const pasos = [];
            // === PASO 1: Laboratorio ===
            const labOk = !!ensayo.laboratorio;
            pasos.push({
                id: 'laboratorio',
                orden: 1,
                nombre: 'Laboratorio',
                descripcion: 'El ensayo debe estar asociado a un laboratorio',
                completado: labOk,
                detalle: labOk ? `Laboratorio: ${ensayo.laboratorio.nombre}` : 'Sin laboratorio asignado',
                ruta: '/admin/laboratorios',
                icono: 'building',
            });
            // === PASO 2: Tipo de Ensayo con variables y DDAs ===
            let tipoOk = false;
            let variablesCount = 0;
            let diasCount = 0;
            if (ensayo.tipoEnsayo) {
                variablesCount = yield this.tipoVarRepo.count({ where: { tipoEnsayo: { id: ensayo.tipoEnsayo.id } } });
                diasCount = yield this.tipoDiaRepo.count({ where: { tipoEnsayo: { id: ensayo.tipoEnsayo.id } } });
                tipoOk = variablesCount > 0 && diasCount > 0;
            }
            pasos.push({
                id: 'tipo_ensayo',
                orden: 2,
                nombre: 'Tipo de Ensayo',
                descripcion: 'Definir tipo de ensayo con variables a medir y días de evaluación (DDA)',
                completado: tipoOk,
                detalle: ensayo.tipoEnsayo
                    ? `${ensayo.tipoEnsayo.nombre} — ${variablesCount} variable(s), ${diasCount} DDA(s)`
                    : 'Sin tipo de ensayo asignado',
                ruta: '/tipos-ensayo',
                icono: 'clipboard-list',
            });
            // === PASO 3: Protocolo con Tratamientos y Productos ===
            let protocoloOk = false;
            let tratamientosCount = 0;
            let tratamientosConProductos = 0;
            if (ensayo.protocolo) {
                const tratamientos = yield this.tratamientoRepo.find({
                    where: { protocolo: { id: ensayo.protocolo.id } },
                    relations: ['productos'],
                });
                tratamientosCount = tratamientos.length;
                tratamientosConProductos = tratamientos.filter(t => t.productos && t.productos.length > 0).length;
                // Considerar OK si hay al menos 1 tratamiento (el testigo puede no tener producto)
                protocoloOk = tratamientosCount > 0;
            }
            pasos.push({
                id: 'protocolo',
                orden: 3,
                nombre: 'Protocolo y Tratamientos',
                descripcion: 'Definir protocolo con tratamientos y sus productos asociados',
                completado: protocoloOk,
                detalle: ensayo.protocolo
                    ? `${ensayo.protocolo.nombre} — ${tratamientosCount} tratamiento(s), ${tratamientosConProductos} con productos`
                    : 'Sin protocolo asignado',
                ruta: ensayo.protocolo ? `/protocolos/${ensayo.protocolo.id}` : '/protocolos',
                icono: 'beaker',
            });
            // === PASO 4: Ensayo creado (siempre completado si estamos aquí) ===
            pasos.push({
                id: 'ensayo',
                orden: 4,
                nombre: 'Ensayo Creado',
                descripcion: 'El ensayo ha sido creado con los datos básicos',
                completado: true,
                detalle: `${ensayo.nombreEnsayo}${ensayo.cultivo ? ' — ' + ensayo.cultivo.nombre : ''}`,
                ruta: `/ensayos/${ensayo.id}`,
                icono: 'document-check',
            });
            // === PASO 5: Bloques ===
            const bloquesCount = yield this.bloqueRepo.count({ where: { ensayo: { id: ensayoId } } });
            const bloquesOk = bloquesCount > 0;
            pasos.push({
                id: 'bloques',
                orden: 5,
                nombre: 'Bloques (Repeticiones)',
                descripcion: 'Crear los bloques/repeticiones del ensayo',
                completado: bloquesOk,
                detalle: `${bloquesCount} bloque(s) creado(s)`,
                ruta: `/bloques?ensayoId=${ensayoId}`,
                icono: 'view-grid',
            });
            // === PASO 6: Parcelas ===
            const parcelasCount = yield this.parcelaRepo.count({ where: { ensayo: { id: ensayoId } } });
            const parcelasEsperadas = bloquesCount * tratamientosCount;
            const parcelasOk = parcelasCount > 0 && (parcelasEsperadas === 0 || parcelasCount >= parcelasEsperadas);
            pasos.push({
                id: 'parcelas',
                orden: 6,
                nombre: 'Parcelas',
                descripcion: 'Generar parcelas (bloque × tratamiento)',
                completado: parcelasOk,
                detalle: parcelasEsperadas > 0
                    ? `${parcelasCount}/${parcelasEsperadas} parcela(s)`
                    : `${parcelasCount} parcela(s) creada(s)`,
                progreso: parcelasEsperadas > 0 ? `${parcelasCount}/${parcelasEsperadas}` : undefined,
                ruta: `/parcelas?ensayoId=${ensayoId}`,
                icono: 'table-cells',
            });
            // === PASO 7: Aplicaciones y Momentos de Evaluación ===
            const aplicacionesCount = yield this.aplicacionRepo.count({ where: { ensayo: { id: ensayoId } } });
            const momentosCount = yield this.momentoRepo
                .createQueryBuilder('m')
                .innerJoin('m.aplicacion', 'a')
                .where('a.ensayo_id_fk = :ensayoId', { ensayoId })
                .getCount();
            const aplicacionesOk = aplicacionesCount > 0 && momentosCount > 0;
            pasos.push({
                id: 'aplicaciones',
                orden: 7,
                nombre: 'Aplicaciones y Momentos',
                descripcion: 'Registrar aplicaciones con sus momentos de evaluación',
                completado: aplicacionesOk,
                detalle: `${aplicacionesCount} aplicación(es), ${momentosCount} momento(s) de evaluación`,
                ruta: `/ensayos/${ensayoId}`,
                icono: 'calendar',
            });
            // === PASO 8: Datos de Siembra ===
            const siembraCount = yield this.datosSiembraRepo
                .createQueryBuilder('ds')
                .innerJoin('ds.parcela', 'p')
                .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
                .getCount();
            const siembraOk = parcelasCount > 0 && siembraCount >= parcelasCount;
            pasos.push({
                id: 'siembra',
                orden: 8,
                nombre: 'Datos de Siembra',
                descripcion: 'Registrar los datos de siembra por parcela',
                completado: siembraOk,
                detalle: `${siembraCount}/${parcelasCount} parcela(s) con datos de siembra`,
                progreso: `${siembraCount}/${parcelasCount}`,
                ruta: '/siembra',
                icono: 'leaf',
            });
            // === PASO 9: Mediciones (Datos de Campo) ===
            const medicionesCount = yield this.datosCampoRepo
                .createQueryBuilder('dc')
                .innerJoin('dc.parcela', 'p')
                .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
                .getCount();
            // Esperado: parcelas × momentos
            const medicionesEsperadas = parcelasCount * momentosCount;
            const medicionesOk = medicionesEsperadas > 0 && medicionesCount >= medicionesEsperadas;
            pasos.push({
                id: 'mediciones',
                orden: 9,
                nombre: 'Mediciones (Datos de Campo)',
                descripcion: 'Registrar las mediciones de campo en cada parcela por cada momento de evaluación',
                completado: medicionesOk,
                detalle: medicionesEsperadas > 0
                    ? `${medicionesCount}/${medicionesEsperadas} registro(s) de medición`
                    : `${medicionesCount} registro(s) de medición`,
                progreso: medicionesEsperadas > 0 ? `${medicionesCount}/${medicionesEsperadas}` : undefined,
                ruta: '/mediciones',
                icono: 'chart-bar',
            });
            // === PASO 10: Datos de Cosecha ===
            const cosechaCount = yield this.datosCosechaRepo
                .createQueryBuilder('dcos')
                .innerJoin('dcos.parcela', 'p')
                .where('p.ensayo_id_fk = :ensayoId', { ensayoId })
                .getCount();
            const cosechaOk = parcelasCount > 0 && cosechaCount >= parcelasCount;
            pasos.push({
                id: 'cosecha',
                orden: 10,
                nombre: 'Datos de Cosecha',
                descripcion: 'Registrar los datos de cosecha por parcela',
                completado: cosechaOk,
                detalle: `${cosechaCount}/${parcelasCount} parcela(s) con datos de cosecha`,
                progreso: `${cosechaCount}/${parcelasCount}`,
                ruta: '/cosecha',
                icono: 'archive-box',
            });
            // === PASO 11: Reportes (disponibilidad) ===
            const reporteDisponible = medicionesOk || cosechaOk; // Al menos una fuente de datos
            pasos.push({
                id: 'reportes',
                orden: 11,
                nombre: 'Reportes',
                descripcion: 'Exportar reportes PDF/Excel con los datos recolectados',
                completado: reporteDisponible,
                detalle: reporteDisponible
                    ? 'Datos suficientes para generar reportes'
                    : 'Se necesitan mediciones o datos de cosecha para generar reportes',
                ruta: '/reportes',
                icono: 'document-text',
            });
            // Calcular progreso
            const completados = pasos.filter(p => p.completado).length;
            const total = pasos.length;
            const porcentaje = Math.round((completados / total) * 100);
            // Siguiente paso
            const siguientePaso = pasos.find(p => !p.completado) || null;
            return {
                ensayoId: ensayo.id,
                nombreEnsayo: ensayo.nombreEnsayo,
                pasos,
                siguientePaso,
                progreso: { completados, total, porcentaje },
            };
        });
    }
    /**
     * Verifica prerequisitos globales antes de poder crear un ensayo
     */
    getPrerequisitos() {
        return __awaiter(this, void 0, void 0, function* () {
            const prerequisitos = [];
            // 1. Laboratorios
            const labCount = yield this.labRepo.count({ where: { esta_activo: true } });
            prerequisitos.push({
                id: 'laboratorios',
                nombre: 'Laboratorios',
                disponible: labCount > 0,
                cantidad: labCount,
                detalle: labCount > 0 ? `${labCount} laboratorio(s) activo(s)` : 'No hay laboratorios creados',
                ruta: '/admin/laboratorios',
            });
            // 2. Productos
            const productoCount = yield this.productoRepo.count();
            prerequisitos.push({
                id: 'productos',
                nombre: 'Productos',
                disponible: productoCount > 0,
                cantidad: productoCount,
                detalle: productoCount > 0 ? `${productoCount} producto(s) disponible(s)` : 'No hay productos creados',
                ruta: '/admin/productos',
            });
            // 3. Tipos de Ensayo con variables
            const tipoCount = yield this.tipoEnsayoRepo.count({ where: { activo: true } });
            // Contar cuántos tipos tienen variables asignadas
            const tiposConVariables = yield this.tipoVarRepo
                .createQueryBuilder('tev')
                .select('tev.tipo_ensayo_id_fk', 'tipoId')
                .groupBy('tev.tipo_ensayo_id_fk')
                .getRawMany();
            prerequisitos.push({
                id: 'tipos_ensayo',
                nombre: 'Tipos de Ensayo',
                disponible: tipoCount > 0 && tiposConVariables.length > 0,
                cantidad: tipoCount,
                detalle: tipoCount > 0
                    ? `${tipoCount} tipo(s), ${tiposConVariables.length} con variables configuradas`
                    : 'No hay tipos de ensayo creados',
                ruta: '/tipos-ensayo',
            });
            // 4. Variables de medición (Protocolo_Variable)
            const varCount = yield this.protoVarRepo.count();
            prerequisitos.push({
                id: 'variables',
                nombre: 'Variables de Medición',
                disponible: varCount > 0,
                cantidad: varCount,
                detalle: varCount > 0 ? `${varCount} variable(s) definida(s)` : 'No hay variables de medición creadas',
                ruta: '/tipos-ensayo',
            });
            // 5. Protocolos con tratamientos
            const protocoloCount = yield this.protocoloRepo.count();
            const protocolosConTrat = yield this.tratamientoRepo
                .createQueryBuilder('t')
                .select('t.protocolo_id_fk', 'protocoloId')
                .groupBy('t.protocolo_id_fk')
                .getRawMany();
            prerequisitos.push({
                id: 'protocolos',
                nombre: 'Protocolos con Tratamientos',
                disponible: protocoloCount > 0 && protocolosConTrat.length > 0,
                cantidad: protocoloCount,
                detalle: protocoloCount > 0
                    ? `${protocoloCount} protocolo(s), ${protocolosConTrat.length} con tratamientos`
                    : 'No hay protocolos creados',
                ruta: '/protocolos',
            });
            // Evaluar si puede crear ensayo (mínimo: lab + tipo + protocolo)
            const puedeCrear = prerequisitos.every(p => p.disponible);
            const faltantes = prerequisitos.filter(p => !p.disponible).map(p => p.nombre);
            return {
                puedeCrearEnsayo: puedeCrear,
                prerequisitos,
                mensaje: puedeCrear
                    ? 'Todos los prerequisitos están cumplidos. Puede crear un nuevo ensayo.'
                    : `Faltan prerequisitos: ${faltantes.join(', ')}`,
            };
        });
    }
};
exports.AsistenteFlujoService = AsistenteFlujoService;
exports.AsistenteFlujoService = AsistenteFlujoService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(ensayo_entity_1.Ensayo)),
    __param(2, (0, typeorm_1.InjectRepository)(bloque_entity_1.Bloque)),
    __param(3, (0, typeorm_1.InjectRepository)(parcela_entity_1.Parcela)),
    __param(4, (0, typeorm_1.InjectRepository)(datos_campo_entity_1.DatosCampo)),
    __param(5, (0, typeorm_1.InjectRepository)(datos_siembra_entity_1.DatosSiembra)),
    __param(6, (0, typeorm_1.InjectRepository)(datos_cosecha_entity_1.DatosCosecha)),
    __param(7, (0, typeorm_1.InjectRepository)(protocolo_entity_1.Protocolo)),
    __param(8, (0, typeorm_1.InjectRepository)(tratamiento_entity_1.Tratamiento)),
    __param(9, (0, typeorm_1.InjectRepository)(tratamiento_producto_entity_1.TratamientoProducto)),
    __param(10, (0, typeorm_1.InjectRepository)(laboratorio_entity_1.Laboratorio)),
    __param(11, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(12, (0, typeorm_1.InjectRepository)(tipo_ensayo_entity_1.TipoEnsayo)),
    __param(13, (0, typeorm_1.InjectRepository)(tipo_ensayo_variable_entity_1.TipoEnsayoVariable)),
    __param(14, (0, typeorm_1.InjectRepository)(tipo_ensayo_evaluacion_dia_entity_1.TipoEnsayoEvaluacionDia)),
    __param(15, (0, typeorm_1.InjectRepository)(protocolo_variable_entity_1.ProtocoloVariable)),
    __param(16, (0, typeorm_1.InjectRepository)(aplicacion_entity_1.Aplicacion)),
    __param(17, (0, typeorm_1.InjectRepository)(momento_evaluacion_entity_1.MomentoEvaluacion)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AsistenteFlujoService);
