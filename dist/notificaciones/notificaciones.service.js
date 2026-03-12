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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var NotificacionesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notificacion_entity_1 = require("./entities/notificacion.entity");
const usuario_entity_1 = require("../entities/usuario.entity");
const ensayo_entity_1 = require("../entities/ensayo.entity");
let NotificacionesService = NotificacionesService_1 = class NotificacionesService {
    constructor(notificacionesRepository, ensayoRepository, usuarioRepository) {
        this.notificacionesRepository = notificacionesRepository;
        this.ensayoRepository = ensayoRepository;
        this.usuarioRepository = usuarioRepository;
        this.logger = new common_1.Logger(NotificacionesService_1.name);
    }
    // ──────────────────── CRUD ────────────────────
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuarioId } = dto, rest = __rest(dto, ["usuarioId"]);
            const entity = this.notificacionesRepository.create(Object.assign(Object.assign({}, rest), { usuario: { id: usuarioId } }));
            return this.notificacionesRepository.save(entity);
        });
    }
    /**
     * Crea la notificación solo si no existe una igual para el mismo día.
     */
    createIfNotExists(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const existing = yield this.notificacionesRepository
                .createQueryBuilder('n')
                .where('n.usuario_id = :userId', { userId: dto.usuarioId })
                .andWhere('n.titulo = :titulo', { titulo: dto.titulo })
                .andWhere('n.createdAt >= :today AND n.createdAt < :tomorrow', { today, tomorrow })
                .getOne();
            if (existing)
                return null;
            return this.create(dto);
        });
    }
    findAll(usuarioId) {
        return this.notificacionesRepository.find({
            where: { usuario: { id: usuarioId } },
            order: { createdAt: 'DESC' },
        });
    }
    findOne(id, usuarioId) {
        return this.notificacionesRepository.findOne({
            where: { id, usuario: { id: usuarioId } },
        });
    }
    update(id, dto, usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificacion = yield this.findOne(id, usuarioId);
            if (!notificacion)
                return null;
            yield this.notificacionesRepository.update(id, dto);
            return this.findOne(id, usuarioId);
        });
    }
    remove(id, usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificacion = yield this.findOne(id, usuarioId);
            if (!notificacion)
                return;
            yield this.notificacionesRepository.delete(id);
        });
    }
    countUnread(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificacionesRepository.count({
                where: { usuario: { id: usuarioId }, leido: false },
            });
        });
    }
    markAllAsRead(usuarioId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.notificacionesRepository
                .createQueryBuilder()
                .update(notificacion_entity_1.Notificacion)
                .set({ leido: true })
                .where('usuario_id = :usuarioId AND leido = false', { usuarioId })
                .execute();
        });
    }
    // ──────────────────── GENERACIÓN ────────────────────
    /**
     * Genera notificaciones para un usuario específico.
     * - Busca TODOS los ensayos (el usuario puede ser Admin/Manager supervisando).
     * - Crea notificaciones para el usuario que solicita.
     * - También crea notificaciones para el responsable del ensayo (si es distinto).
     */
    generateForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ensayos = yield this.ensayoRepository.find({
                relations: [
                    'responsable',
                    'aplicaciones',
                    'aplicaciones.momentos',
                    'parcelas',
                    'parcelas.siembra',
                    'parcelas.cosecha',
                ],
            });
            this.logger.log(`Generando notificaciones para usuario ${userId}, evaluando ${ensayos.length} ensayo(s)`);
            const hoy = new Date();
            const esLunes = hoy.getDay() === 1;
            for (const ensayo of ensayos) {
                // Determinar a quién notificar: al usuario solicitante y al responsable (sin duplicar)
                const destinatarios = new Set();
                destinatarios.add(userId);
                if (((_a = ensayo.responsable) === null || _a === void 0 ? void 0 : _a.id) && ensayo.responsable.id !== userId) {
                    destinatarios.add(ensayo.responsable.id);
                }
                for (const destUserId of destinatarios) {
                    yield this.checkFechasClave(ensayo, destUserId, hoy);
                    yield this.checkMomentosEvaluacion(ensayo, destUserId, hoy);
                    yield this.checkInfoIncompleta(ensayo, destUserId);
                    if (esLunes) {
                        yield this.generarResumenSemanal(ensayo, destUserId, hoy);
                    }
                }
            }
        });
    }
    /**
     * Genera notificaciones para TODOS los ensayos, notificando a cada responsable.
     * Se ejecuta desde el cron job diario.
     */
    generateForAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const ensayos = yield this.ensayoRepository.find({
                relations: [
                    'responsable',
                    'aplicaciones',
                    'aplicaciones.momentos',
                    'parcelas',
                    'parcelas.siembra',
                    'parcelas.cosecha',
                ],
            });
            this.logger.log(`Cron: evaluando ${ensayos.length} ensayo(s) para generar notificaciones`);
            const hoy = new Date();
            const esLunes = hoy.getDay() === 1;
            for (const ensayo of ensayos) {
                if (!((_a = ensayo.responsable) === null || _a === void 0 ? void 0 : _a.id))
                    continue;
                const userId = ensayo.responsable.id;
                yield this.checkFechasClave(ensayo, userId, hoy);
                yield this.checkMomentosEvaluacion(ensayo, userId, hoy);
                yield this.checkInfoIncompleta(ensayo, userId);
                if (esLunes) {
                    yield this.generarResumenSemanal(ensayo, userId, hoy);
                }
            }
        });
    }
    // ──────────────────── Helpers privados ────────────────────
    checkFechasClave(ensayo, userId, hoy) {
        return __awaiter(this, void 0, void 0, function* () {
            const hoyStr = this.toDateStr(hoy);
            if (ensayo.fechaSiembra) {
                const str = this.toDateStr(new Date(ensayo.fechaSiembra));
                if (hoyStr === str) {
                    yield this.createIfNotExists({
                        usuarioId: userId,
                        titulo: `Siembra - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
                        descripcion: `Hoy ${str} es la fecha programada para la siembra del ensayo "${ensayo.nombreEnsayo}".`,
                        link: `/siembra?ensayoId=${ensayo.id}`,
                        tipo: notificacion_entity_1.TipoNotificacion.SIEMBRA,
                        ensayoId: ensayo.id,
                    });
                }
            }
            if (ensayo.fechaCosecha) {
                const str = this.toDateStr(new Date(ensayo.fechaCosecha));
                if (hoyStr === str) {
                    yield this.createIfNotExists({
                        usuarioId: userId,
                        titulo: `Cosecha - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
                        descripcion: `Hoy ${str} es la fecha programada para la cosecha del ensayo "${ensayo.nombreEnsayo}".`,
                        link: `/cosecha?ensayoId=${ensayo.id}`,
                        tipo: notificacion_entity_1.TipoNotificacion.COSECHA,
                        ensayoId: ensayo.id,
                    });
                }
            }
            if (ensayo.fechaInicio) {
                const str = this.toDateStr(new Date(ensayo.fechaInicio));
                if (hoyStr === str) {
                    yield this.createIfNotExists({
                        usuarioId: userId,
                        titulo: `Inicio - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
                        descripcion: `Hoy ${str} es la fecha de inicio del ensayo "${ensayo.nombreEnsayo}".`,
                        link: `/ensayos/${ensayo.id}`,
                        tipo: notificacion_entity_1.TipoNotificacion.GENERAL,
                        ensayoId: ensayo.id,
                    });
                }
            }
        });
    }
    checkMomentosEvaluacion(ensayo, userId, hoy) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ensayo.aplicaciones)
                return;
            const hoyStr = this.toDateStr(hoy);
            for (const aplicacion of ensayo.aplicaciones) {
                if (!aplicacion.momentos)
                    continue;
                for (const momento of aplicacion.momentos) {
                    let fechaEvalStr = null;
                    if (momento.fechaEvaluacion) {
                        fechaEvalStr = this.toDateStr(new Date(momento.fechaEvaluacion));
                    }
                    else if (momento.diasDespuesAplicacion != null && aplicacion.fechaHora) {
                        const fechaApp = new Date(aplicacion.fechaHora);
                        fechaApp.setDate(fechaApp.getDate() + momento.diasDespuesAplicacion);
                        fechaEvalStr = this.toDateStr(fechaApp);
                    }
                    if (fechaEvalStr && hoyStr === fechaEvalStr) {
                        const ddaLabel = momento.diasDespuesAplicacion != null
                            ? ` (DDA ${momento.diasDespuesAplicacion})`
                            : '';
                        yield this.createIfNotExists({
                            usuarioId: userId,
                            titulo: `Medición${ddaLabel} - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
                            descripcion: `Hoy corresponde tomar mediciones "${momento.nombreMomento}" (${aplicacion.nombreAplicacion})${ddaLabel} en el ensayo "${ensayo.nombreEnsayo}".`,
                            link: `/mediciones?ensayoId=${ensayo.id}`,
                            tipo: notificacion_entity_1.TipoNotificacion.MEDICION,
                            ensayoId: ensayo.id,
                        });
                    }
                }
            }
        });
    }
    checkInfoIncompleta(ensayo, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendientes = [];
            if (!ensayo.fechaSiembra)
                pendientes.push('fecha de siembra');
            if (!ensayo.fechaCosecha)
                pendientes.push('fecha de cosecha');
            if (!ensayo.fechaInicio)
                pendientes.push('fecha de inicio');
            if (ensayo.parcelas && ensayo.parcelas.length > 0) {
                const sinSiembra = ensayo.parcelas.filter(p => !p.siembra).length;
                if (sinSiembra > 0) {
                    pendientes.push(`datos de siembra en ${sinSiembra} parcela(s)`);
                }
                if (ensayo.fechaCosecha && new Date(ensayo.fechaCosecha) <= new Date()) {
                    const sinCosecha = ensayo.parcelas.filter(p => !p.cosecha).length;
                    if (sinCosecha > 0) {
                        pendientes.push(`datos de cosecha en ${sinCosecha} parcela(s)`);
                    }
                }
            }
            if (pendientes.length > 0) {
                yield this.createIfNotExists({
                    usuarioId: userId,
                    titulo: `Info incompleta - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
                    descripcion: `El ensayo "${ensayo.nombreEnsayo}" tiene información pendiente: ${pendientes.join(', ')}.`,
                    link: `/ensayos/${ensayo.id}`,
                    tipo: notificacion_entity_1.TipoNotificacion.INFO_INCOMPLETA,
                    ensayoId: ensayo.id,
                });
            }
        });
    }
    generarResumenSemanal(ensayo, userId, hoy) {
        return __awaiter(this, void 0, void 0, function* () {
            const tareas = [];
            const inicio = new Date(hoy);
            inicio.setHours(0, 0, 0, 0);
            const fin = new Date(inicio);
            fin.setDate(inicio.getDate() + 6);
            if (ensayo.fechaSiembra) {
                const d = new Date(ensayo.fechaSiembra);
                if (d >= inicio && d <= fin)
                    tareas.push(`Siembra programada para ${this.toDateStr(d)}`);
            }
            if (ensayo.fechaCosecha) {
                const d = new Date(ensayo.fechaCosecha);
                if (d >= inicio && d <= fin)
                    tareas.push(`Cosecha programada para ${this.toDateStr(d)}`);
            }
            if (ensayo.aplicaciones) {
                for (const app of ensayo.aplicaciones) {
                    if (!app.momentos)
                        continue;
                    for (const m of app.momentos) {
                        let fechaEval = null;
                        if (m.fechaEvaluacion) {
                            fechaEval = new Date(m.fechaEvaluacion);
                        }
                        else if (m.diasDespuesAplicacion != null && app.fechaHora) {
                            fechaEval = new Date(app.fechaHora);
                            fechaEval.setDate(fechaEval.getDate() + m.diasDespuesAplicacion);
                        }
                        if (fechaEval && fechaEval >= inicio && fechaEval <= fin) {
                            tareas.push(`Medición "${m.nombreMomento}" el ${this.toDateStr(fechaEval)}`);
                        }
                    }
                }
            }
            if (tareas.length > 0) {
                yield this.createIfNotExists({
                    usuarioId: userId,
                    titulo: `Resumen semanal - Ensayo #${ensayo.id}: ${ensayo.nombreEnsayo}`,
                    descripcion: `Tareas de la semana para "${ensayo.nombreEnsayo}": ${tareas.join('; ')}.`,
                    link: `/ensayos/${ensayo.id}`,
                    tipo: notificacion_entity_1.TipoNotificacion.RESUMEN_SEMANAL,
                    ensayoId: ensayo.id,
                });
            }
        });
    }
    toDateStr(d) {
        return d.toISOString().split('T')[0];
    }
};
exports.NotificacionesService = NotificacionesService;
exports.NotificacionesService = NotificacionesService = NotificacionesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notificacion_entity_1.Notificacion)),
    __param(1, (0, typeorm_1.InjectRepository)(ensayo_entity_1.Ensayo)),
    __param(2, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificacionesService);
