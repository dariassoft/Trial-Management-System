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
exports.DatosSiembraService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const datos_siembra_entity_1 = require("../entities/datos-siembra.entity");
let DatosSiembraService = class DatosSiembraService {
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
        const entity = this.repo.create({
            parcela: { id: dto.parcelaId },
            fechaSiembra: dto.fechaSiembra ? new Date(dto.fechaSiembra) : undefined,
            semillasPorMetro: dto.semillasPorMetro,
            densidadSiembra: dto.densidadSiembra,
            germinacionPct: dto.germinacionPct,
            vigorPlantasEscala: dto.vigorPlantasEscala,
            observaciones: dto.observaciones,
        });
        return this.repo.save(entity);
    }
    findAll() {
        const { isInvitado, labIds } = this.auth;
        if (!isInvitado) {
            return this.repo.find({ relations: { parcela: true } });
        }
        const qb = this.repo.createQueryBuilder('ds')
            .leftJoinAndSelect('ds.parcela', 'parcela')
            .leftJoin('parcela.tratamiento', 'trat')
            .leftJoin('trat.productos', 'tp')
            .leftJoin('tp.producto', 'prod')
            .leftJoin('prod.laboratorio', 'lab')
            .where('lab.id IN (:...labIds)', { labIds })
            .distinct(true);
        return qb.getMany();
    }
    findByParcelaId(parcelaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                return this.repo.find({
                    where: { parcela: { id: parcelaId } },
                    relations: { parcela: true }
                });
            }
            const qb = this.repo.createQueryBuilder('ds')
                .leftJoinAndSelect('ds.parcela', 'parcela')
                .leftJoin('parcela.tratamiento', 'trat')
                .leftJoin('trat.productos', 'tp')
                .leftJoin('tp.producto', 'prod')
                .leftJoin('prod.laboratorio', 'lab')
                .where('parcela.id = :parcelaId', { parcelaId })
                .andWhere('lab.id IN (:...labIds)', { labIds })
                .distinct(true);
            return qb.getMany();
        });
    }
    findByEnsayoId(ensayoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                return this.repo.find({
                    where: { parcela: { ensayo: { id: ensayoId } } },
                    relations: { parcela: { ensayo: true, bloque: true, tratamiento: true } },
                    order: { parcela: { id: 'ASC' } }
                });
            }
            const qb = this.repo.createQueryBuilder('ds')
                .leftJoinAndSelect('ds.parcela', 'parcela')
                .leftJoinAndSelect('parcela.ensayo', 'ensayo')
                .leftJoinAndSelect('parcela.bloque', 'bloque')
                .leftJoinAndSelect('parcela.tratamiento', 'tratamiento')
                .leftJoin('tratamiento.productos', 'tp')
                .leftJoin('tp.producto', 'prod')
                .leftJoin('prod.laboratorio', 'lab')
                .where('ensayo.id = :ensayoId', { ensayoId })
                .andWhere('lab.id IN (:...labIds)', { labIds })
                .orderBy('parcela.id', 'ASC')
                .distinct(true);
            return qb.getMany();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                const entity = yield this.repo.findOne({ where: { id }, relations: { parcela: true } });
                if (!entity)
                    throw new common_1.NotFoundException(`DatosSiembra ${id} no encontrado`);
                return entity;
            }
            const qb = this.repo.createQueryBuilder('ds')
                .leftJoinAndSelect('ds.parcela', 'parcela')
                .leftJoin('parcela.tratamiento', 'trat')
                .leftJoin('trat.productos', 'tp')
                .leftJoin('tp.producto', 'prod')
                .leftJoin('prod.laboratorio', 'lab')
                .where('ds.id = :id', { id })
                .andWhere('lab.id IN (:...labIds)', { labIds })
                .distinct(true);
            const entity = yield qb.getOne();
            if (!entity)
                throw new common_1.NotFoundException(`DatosSiembra ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const partial = {
                fechaSiembra: dto.fechaSiembra ? new Date(dto.fechaSiembra) : undefined,
                semillasPorMetro: dto.semillasPorMetro,
                densidadSiembra: dto.densidadSiembra,
                germinacionPct: dto.germinacionPct,
                vigorPlantasEscala: dto.vigorPlantasEscala,
                observaciones: dto.observaciones,
            };
            if (dto.parcelaId !== undefined)
                partial.parcela = { id: dto.parcelaId };
            yield this.repo.update({ id }, partial);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`DatosSiembra ${id} no encontrado`);
            return { deleted: true };
        });
    }
};
exports.DatosSiembraService = DatosSiembraService;
exports.DatosSiembraService = DatosSiembraService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(datos_siembra_entity_1.DatosSiembra)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], DatosSiembraService);
