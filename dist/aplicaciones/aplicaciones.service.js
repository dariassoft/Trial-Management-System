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
exports.AplicacionesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const aplicacion_entity_1 = require("../entities/aplicacion.entity");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const tipo_ensayo_evaluacion_dia_entity_1 = require("../entities/tipo-ensayo-evaluacion-dia.entity");
const momento_evaluacion_entity_1 = require("../entities/momento-evaluacion.entity");
let AplicacionesService = class AplicacionesService {
    constructor(req, repo, ensayoRepo, diasRepo, momentoRepo, dataSource) {
        this.req = req;
        this.repo = repo;
        this.ensayoRepo = ensayoRepo;
        this.diasRepo = diasRepo;
        this.momentoRepo = momentoRepo;
        this.dataSource = dataSource;
    }
    get auth() {
        var _a;
        const user = (_a = this.req) === null || _a === void 0 ? void 0 : _a.user;
        const isInvitado = (user === null || user === void 0 ? void 0 : user.rol) === rol_entity_1.Role.INVITADO;
        const labIds = ((user === null || user === void 0 ? void 0 : user.lab_ids) || []);
        return { isInvitado, labIds };
    }
    /**
     * Crear aplicación y generar momentos de evaluación automáticamente
     * según los días configurados en el tipo de ensayo
     */
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const qr = this.dataSource.createQueryRunner();
            yield qr.connect();
            yield qr.startTransaction();
            try {
                // Crear la aplicación
                const entity = this.repo.create({
                    ensayo: { id: dto.ensayoId },
                    nombreAplicacion: dto.nombreAplicacion || 'Primera aplicación',
                    fechaHora: dto.fechaHora ? new Date(dto.fechaHora) : undefined,
                    estadioCultivo: dto.estadioCultivo,
                    tempC: dto.tempC,
                    humedadPct: dto.humedadPct,
                    vientoKmh: dto.vientoKmh,
                    equipoInfo: dto.equipoInfo,
                    picoInfo: dto.picoInfo,
                    presionBar: dto.presionBar,
                });
                const aplicacionGuardada = yield qr.manager.save(entity);
                // Obtener el ensayo con su tipo de ensayo
                const ensayo = yield this.ensayoRepo.findOne({
                    where: { id: dto.ensayoId },
                    relations: ['tipoEnsayo'],
                });
                if ((_a = ensayo === null || ensayo === void 0 ? void 0 : ensayo.tipoEnsayo) === null || _a === void 0 ? void 0 : _a.id) {
                    // Obtener los días de evaluación configurados para este tipo de ensayo
                    const diasEvaluacion = yield this.diasRepo.find({
                        where: { tipoEnsayo: { id: ensayo.tipoEnsayo.id } },
                        order: { dia: 'ASC' },
                    });
                    // Crear momentos de evaluación para cada día
                    const fechaAplicacion = dto.fechaHora ? new Date(dto.fechaHora) : new Date();
                    for (const diaConfig of diasEvaluacion) {
                        const fechaEvaluacion = new Date(fechaAplicacion);
                        fechaEvaluacion.setDate(fechaEvaluacion.getDate() + diaConfig.dia);
                        const momento = this.momentoRepo.create({
                            aplicacion: aplicacionGuardada,
                            nombreMomento: `${diaConfig.dia} DDA`,
                            diasDespuesAplicacion: diaConfig.dia,
                            fechaEvaluacion: fechaEvaluacion,
                        });
                        yield qr.manager.save(momento);
                    }
                }
                yield qr.commitTransaction();
                return this.findOne(aplicacionGuardada.id);
            }
            catch (e) {
                yield qr.rollbackTransaction();
                throw e;
            }
            finally {
                yield qr.release();
            }
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            const qb = this.repo.createQueryBuilder('a')
                .leftJoinAndSelect('a.ensayo', 'e')
                .leftJoinAndSelect('a.momentos', 'm')
                .orderBy('a.fechaHora', 'DESC');
            if (query === null || query === void 0 ? void 0 : query.ensayoId) {
                qb.andWhere('e.id = :ensayoId', { ensayoId: query.ensayoId });
            }
            if (isInvitado) {
                qb.leftJoin('e.tratamientos', 't')
                    .leftJoin('t.productos', 'tp')
                    .leftJoin('tp.producto', 'p')
                    .leftJoin('p.laboratorio', 'l')
                    .andWhere('l.id IN (:...labIds)', { labIds })
                    .distinct(true);
            }
            return qb.getMany();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            const qb = this.repo.createQueryBuilder('a')
                .leftJoinAndSelect('a.ensayo', 'e')
                .leftJoinAndSelect('e.tipoEnsayo', 'te')
                .leftJoinAndSelect('a.momentos', 'm')
                .where('a.id = :id', { id })
                .orderBy('m.diasDespuesAplicacion', 'ASC');
            if (isInvitado) {
                qb.leftJoin('e.tratamientos', 't')
                    .leftJoin('t.productos', 'tp')
                    .leftJoin('tp.producto', 'p')
                    .leftJoin('p.laboratorio', 'l')
                    .andWhere('l.id IN (:...labIds)', { labIds })
                    .distinct(true);
            }
            const entity = yield qb.getOne();
            if (!entity)
                throw new common_1.NotFoundException(`Aplicacion ${id} no encontrada`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Solo incluir campos que tienen valor definido
            const partial = {};
            if (dto.nombreAplicacion !== undefined) {
                partial.nombreAplicacion = dto.nombreAplicacion;
            }
            if (dto.fechaHora !== undefined) {
                partial.fechaHora = dto.fechaHora ? new Date(dto.fechaHora) : null;
            }
            if (dto.estadioCultivo !== undefined) {
                partial.estadioCultivo = dto.estadioCultivo;
            }
            if (dto.tempC !== undefined) {
                partial.tempC = dto.tempC;
            }
            if (dto.humedadPct !== undefined) {
                partial.humedadPct = dto.humedadPct;
            }
            if (dto.vientoKmh !== undefined) {
                partial.vientoKmh = dto.vientoKmh;
            }
            if (dto.equipoInfo !== undefined) {
                partial.equipoInfo = dto.equipoInfo;
            }
            if (dto.picoInfo !== undefined) {
                partial.picoInfo = dto.picoInfo;
            }
            if (dto.presionBar !== undefined) {
                partial.presionBar = dto.presionBar;
            }
            if (dto.ensayoId !== undefined) {
                partial.ensayo = { id: dto.ensayoId };
            }
            if (Object.keys(partial).length > 0) {
                yield this.repo.update({ id }, partial);
            }
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Aplicacion ${id} no encontrada`);
            return { deleted: true };
        });
    }
};
exports.AplicacionesService = AplicacionesService;
exports.AplicacionesService = AplicacionesService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(aplicacion_entity_1.Aplicacion)),
    __param(2, (0, typeorm_1.InjectRepository)(ensayo_entity_1.Ensayo)),
    __param(3, (0, typeorm_1.InjectRepository)(tipo_ensayo_evaluacion_dia_entity_1.TipoEnsayoEvaluacionDia)),
    __param(4, (0, typeorm_1.InjectRepository)(momento_evaluacion_entity_1.MomentoEvaluacion)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AplicacionesService);
