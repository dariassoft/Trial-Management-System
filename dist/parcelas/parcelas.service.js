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
exports.ParcelasService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const parcela_entity_1 = require("../entities/parcela.entity");
let ParcelasService = class ParcelasService {
    constructor(req, repo) {
        this.req = req;
        this.repo = repo;
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
            var _a;
            try {
                const entity = this.repo.create({
                    ensayo: { id: dto.ensayoId },
                    bloque: { id: dto.bloqueId },
                    tratamiento: { id: dto.tratamientoId },
                    nombreParcela: dto.nombreParcela,
                    posXGrid: dto.posXGrid,
                    posYGrid: dto.posYGrid,
                });
                return yield this.repo.save(entity);
            }
            catch (error) {
                // Manejar error de clave duplicada
                if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                    if ((_a = error.sqlMessage) === null || _a === void 0 ? void 0 : _a.includes('uq_parcela_ensayo_nombre')) {
                        throw new common_1.ConflictException(`Ya existe una parcela con el nombre "${dto.nombreParcela}" en este ensayo. Por favor, usa un nombre diferente o ajusta las posiciones X/Y.`);
                    }
                    throw new common_1.ConflictException('Ya existe una parcela con estos datos. Verifica que no haya duplicados.');
                }
                throw error;
            }
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (params = {}) {
            const { page = 1, limit = 10, sort = 'id', order = 'ASC', ensayoId, bloqueId, q } = params;
            const skip = (page - 1) * limit;
            const { isInvitado, labIds } = this.auth;
            const qb = this.repo.createQueryBuilder('pa')
                .leftJoinAndSelect('pa.ensayo', 'ensayo')
                .leftJoinAndSelect('pa.bloque', 'bloque')
                .leftJoinAndSelect('pa.tratamiento', 'tratamiento')
                .leftJoinAndSelect('pa.siembra', 'siembra')
                .leftJoinAndSelect('pa.cosecha', 'cosecha');
            if (isInvitado) {
                qb.leftJoin('tratamiento.productos', 'tp')
                    .leftJoin('tp.producto', 'prod')
                    .leftJoin('prod.laboratorio', 'lab')
                    .where('lab.id IN (:...labIds)', { labIds });
            }
            if (ensayoId) {
                qb.andWhere('pa.ensayo.id = :ensayoId', { ensayoId });
            }
            if (bloqueId) {
                qb.andWhere('pa.bloque.id = :bloqueId', { bloqueId });
            }
            if (q && q.trim()) {
                const searchTerm = `%${q.trim()}%`;
                qb.andWhere(`(
        LOWER(pa.nombreParcela) LIKE LOWER(:q) OR
        LOWER(ensayo.nombreEnsayo) LIKE LOWER(:q) OR
        LOWER(ensayo.codigoLabor) LIKE LOWER(:q) OR
        LOWER(tratamiento.descripcion) LIKE LOWER(:q) OR
        LOWER(bloque.nombreBloque) LIKE LOWER(:q)
      )`, { q: searchTerm });
            }
            qb.orderBy(`pa.${sort}`, order)
                .skip(skip)
                .take(limit);
            const [data, total] = yield qb.getManyAndCount();
            const pageCount = Math.ceil(total / limit);
            return {
                data,
                meta: {
                    total,
                    page,
                    limit,
                    pageCount,
                },
            };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                const entity = yield this.repo.findOne({
                    where: { id },
                    relations: { ensayo: true, bloque: true, tratamiento: true, siembra: true, cosecha: true }
                });
                if (!entity)
                    throw new common_1.NotFoundException(`Parcela ${id} no encontrada`);
                return entity;
            }
            const qb = this.repo.createQueryBuilder('pa')
                .leftJoinAndSelect('pa.ensayo', 'ensayo')
                .leftJoinAndSelect('pa.bloque', 'bloque')
                .leftJoinAndSelect('pa.tratamiento', 'tratamiento')
                .leftJoinAndSelect('pa.siembra', 'siembra')
                .leftJoinAndSelect('pa.cosecha', 'cosecha')
                .leftJoin('tratamiento.productos', 'tp')
                .leftJoin('tp.producto', 'prod')
                .leftJoin('prod.laboratorio', 'lab')
                .where('pa.id = :id', { id })
                .andWhere('lab.id IN (:...labIds)', { labIds })
                .distinct(true);
            const entity = yield qb.getOne();
            if (!entity)
                throw new common_1.NotFoundException(`Parcela ${id} no encontrada`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const partial = {
                    nombreParcela: (_a = dto.nombreParcela) !== null && _a !== void 0 ? _a : undefined,
                    posXGrid: (_b = dto.posXGrid) !== null && _b !== void 0 ? _b : undefined,
                    posYGrid: (_c = dto.posYGrid) !== null && _c !== void 0 ? _c : undefined,
                };
                if (dto.ensayoId !== undefined)
                    partial.ensayo = { id: dto.ensayoId };
                if (dto.bloqueId !== undefined)
                    partial.bloque = { id: dto.bloqueId };
                if (dto.tratamientoId !== undefined)
                    partial.tratamiento = { id: dto.tratamientoId };
                yield this.repo.update({ id }, partial);
                return this.findOne(id);
            }
            catch (error) {
                // Manejar error de clave duplicada
                if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
                    if ((_d = error.sqlMessage) === null || _d === void 0 ? void 0 : _d.includes('uq_parcela_ensayo_nombre')) {
                        throw new common_1.ConflictException(`Ya existe una parcela con el nombre "${dto.nombreParcela}" en este ensayo. Por favor, usa un nombre diferente o ajusta las posiciones X/Y.`);
                    }
                    if (((_e = error.sqlMessage) === null || _e === void 0 ? void 0 : _e.includes('posXGrid')) || ((_f = error.sqlMessage) === null || _f === void 0 ? void 0 : _f.includes('posYGrid'))) {
                        throw new common_1.ConflictException(`La posición (${dto.posXGrid}, ${dto.posYGrid}) ya está ocupada en este bloque.`);
                    }
                    throw new common_1.ConflictException('Ya existe una parcela con estos datos. Verifica que no haya duplicados.');
                }
                throw error;
            }
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Parcela ${id} no encontrada`);
            return { deleted: true };
        });
    }
};
exports.ParcelasService = ParcelasService;
exports.ParcelasService = ParcelasService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(parcela_entity_1.Parcela)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], ParcelasService);
