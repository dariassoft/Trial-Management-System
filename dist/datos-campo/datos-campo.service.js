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
exports.DatosCampoService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const datos_campo_medicion_entity_1 = require("../entities/datos-campo-medicion.entity");
let DatosCampoService = class DatosCampoService {
    constructor(req, repo, medicionRepo, dataSource) {
        this.req = req;
        this.repo = repo;
        this.medicionRepo = medicionRepo;
        this.dataSource = dataSource;
    }
    get auth() {
        var _a;
        const user = (_a = this.req) === null || _a === void 0 ? void 0 : _a.user;
        const isInvitado = (user === null || user === void 0 ? void 0 : user.rol) === rol_entity_1.Role.INVITADO;
        const labIds = ((user === null || user === void 0 ? void 0 : user.lab_ids) || []);
        return { isInvitado, labIds };
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = this.dataSource.createQueryRunner();
            yield qr.connect();
            yield qr.startTransaction();
            try {
                const visita = this.repo.create({
                    parcela: { id: dto.parcela_id_fk },
                    momento: { id: dto.momento_id_fk },
                    observaciones: dto.observaciones,
                });
                const visitaGuardada = yield qr.manager.save(visita);
                const mediciones = (dto.mediciones || []).map((m) => {
                    const med = new datos_campo_medicion_entity_1.DatosCampoMedicion();
                    med.visita = visitaGuardada;
                    med.variable = { id: m.variable_id };
                    med.valor = m.valor;
                    return med;
                });
                if (mediciones.length) {
                    yield qr.manager.save(datos_campo_medicion_entity_1.DatosCampoMedicion, mediciones);
                }
                yield qr.commitTransaction();
                return this.findOne(visitaGuardada.id);
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
            var _a, _b, _c, _d;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query === null || query === void 0 ? void 0 : query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query === null || query === void 0 ? void 0 : query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const { isInvitado, labIds } = this.auth;
            const qb = this.repo.createQueryBuilder('dc')
                .leftJoinAndSelect('dc.parcela', 'parcela')
                .leftJoinAndSelect('dc.momento', 'momento')
                .leftJoinAndSelect('dc.mediciones', 'mediciones')
                .leftJoinAndSelect('mediciones.variable', 'variable');
            if (query === null || query === void 0 ? void 0 : query.parcelaId)
                qb.andWhere('parcela.id = :parcelaId', { parcelaId: query.parcelaId });
            if (query === null || query === void 0 ? void 0 : query.momentoId)
                qb.andWhere('momento.id = :momentoId', { momentoId: query.momentoId });
            if (isInvitado) {
                qb.leftJoin('parcela.tratamiento', 'trat')
                    .leftJoin('trat.productos', 'tp')
                    .leftJoin('tp.producto', 'prod')
                    .leftJoin('prod.laboratorio', 'lab')
                    .andWhere('lab.id IN (:...labIds)', { labIds })
                    .distinct(true);
            }
            const [data, total] = yield qb
                .orderBy(`dc.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                const entity = yield this.repo.findOne({ where: { id }, relations: ['parcela', 'momento', 'mediciones', 'mediciones.variable'] });
                if (!entity)
                    throw new common_1.NotFoundException(`DatosCampo ${id} no encontrado`);
                return entity;
            }
            const qb = this.repo.createQueryBuilder('dc')
                .leftJoinAndSelect('dc.parcela', 'parcela')
                .leftJoinAndSelect('dc.momento', 'momento')
                .leftJoinAndSelect('dc.mediciones', 'mediciones')
                .leftJoinAndSelect('mediciones.variable', 'variable')
                .leftJoin('parcela.tratamiento', 'trat')
                .leftJoin('trat.productos', 'tp')
                .leftJoin('tp.producto', 'prod')
                .leftJoin('prod.laboratorio', 'lab')
                .where('dc.id = :id', { id })
                .andWhere('lab.id IN (:...labIds)', { labIds })
                .distinct(true);
            const entity = yield qb.getOne();
            if (!entity)
                throw new common_1.NotFoundException(`DatosCampo ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const qr = this.dataSource.createQueryRunner();
            yield qr.connect();
            yield qr.startTransaction();
            try {
                // 1) Cargar la visita existente y validar
                const visita = yield qr.manager.findOne(datos_campo_entity_1.DatosCampo, { where: { id } });
                if (!visita)
                    throw new common_1.NotFoundException(`DatosCampo ${id} no encontrado`);
                // 2) Actualizar solo campos simples permitidos (NO cambiar parcela/momento)
                if (dto.observaciones !== undefined) {
                    visita.observaciones = dto.observaciones;
                    yield qr.manager.save(datos_campo_entity_1.DatosCampo, visita);
                }
                // 3) Reemplazar mediciones si se envía el arreglo completo
                if (dto.mediciones) {
                    yield qr.manager.delete(datos_campo_medicion_entity_1.DatosCampoMedicion, { visita: { id } });
                    const mediciones = dto.mediciones.map((m) => {
                        const med = new datos_campo_medicion_entity_1.DatosCampoMedicion();
                        med.visita = { id };
                        med.variable = { id: m.variable_id };
                        med.valor = m.valor;
                        return med;
                    });
                    if (mediciones.length)
                        yield qr.manager.save(datos_campo_medicion_entity_1.DatosCampoMedicion, mediciones);
                }
                yield qr.commitTransaction();
                return this.findOne(id);
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
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`DatosCampo ${id} no encontrado`);
            return { deleted: true };
        });
    }
    findMedicionesByVariable(variableId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query === null || query === void 0 ? void 0 : query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query === null || query === void 0 ? void 0 : query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const { isInvitado, labIds } = this.auth;
            const qb = this.medicionRepo.createQueryBuilder('m')
                .leftJoinAndSelect('m.variable', 'variable')
                .leftJoinAndSelect('m.visita', 'visita')
                .leftJoinAndSelect('visita.parcela', 'parcela')
                .leftJoinAndSelect('visita.momento', 'momento')
                .where('variable.id = :variableId', { variableId });
            if (isInvitado) {
                qb.leftJoin('parcela.tratamiento', 'trat')
                    .leftJoin('trat.productos', 'tp')
                    .leftJoin('tp.producto', 'prod')
                    .leftJoin('prod.laboratorio', 'lab')
                    .andWhere('lab.id IN (:...labIds)', { labIds })
                    .distinct(true);
            }
            const [data, total] = yield qb
                .orderBy(`m.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
        });
    }
    findMedicionesByVisita(visitaId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query === null || query === void 0 ? void 0 : query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query === null || query === void 0 ? void 0 : query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const { isInvitado, labIds } = this.auth;
            const qb = this.medicionRepo.createQueryBuilder('m')
                .leftJoinAndSelect('m.variable', 'variable')
                .leftJoinAndSelect('m.visita', 'visita')
                .leftJoinAndSelect('visita.parcela', 'parcela')
                .leftJoinAndSelect('visita.momento', 'momento')
                .where('visita.id = :visitaId', { visitaId });
            if (isInvitado) {
                qb.leftJoin('parcela.tratamiento', 'trat')
                    .leftJoin('trat.productos', 'tp')
                    .leftJoin('tp.producto', 'prod')
                    .leftJoin('prod.laboratorio', 'lab')
                    .andWhere('lab.id IN (:...labIds)', { labIds })
                    .distinct(true);
            }
            const [data, total] = yield qb
                .orderBy(`m.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
        });
    }
};
exports.DatosCampoService = DatosCampoService;
exports.DatosCampoService = DatosCampoService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(datos_campo_entity_1.DatosCampo)),
    __param(2, (0, typeorm_1.InjectRepository)(datos_campo_medicion_entity_1.DatosCampoMedicion)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], DatosCampoService);
