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
exports.TratamientosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tratamiento_entity_1 = require("../entities/tratamiento.entity");
const protocolo_entity_1 = require("../entities/protocolo.entity");
let TratamientosService = class TratamientosService {
    constructor(req, repo, protocoloRepo) {
        this.req = req;
        this.repo = repo;
        this.protocoloRepo = protocoloRepo;
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
            const entity = this.repo.create({
                numeroTrat: dto.numeroTrat,
                descripcion: dto.descripcion,
                esTestigo: (_a = dto.esTestigo) !== null && _a !== void 0 ? _a : false,
            });
            if (dto.protocoloId) {
                entity.protocolo = { id: dto.protocoloId };
            }
            return this.repo.save(entity);
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { page = 1, limit = 10, sort = 'numeroTrat', order = 'ASC', q, protocoloId, esTestigo, } = options;
            const qb = this.repo.createQueryBuilder('t')
                .leftJoinAndSelect('t.protocolo', 'protocolo')
                .leftJoinAndSelect('t.productos', 'productos')
                .leftJoinAndSelect('productos.producto', 'producto');
            // Filtro por protocolo
            if (protocoloId) {
                qb.andWhere('t.protocolo.id = :protocoloId', { protocoloId });
            }
            // Filtro por si es testigo
            if (esTestigo !== undefined) {
                qb.andWhere('t.esTestigo = :esTestigo', { esTestigo });
            }
            // Búsqueda general
            if (q) {
                qb.andWhere('(LOWER(t.descripcion) LIKE LOWER(:q) OR LOWER(protocolo.nombre) LIKE LOWER(:q))', { q: `%${q}%` });
            }
            // Ordenamiento
            const allowedSorts = ['id', 'numeroTrat', 'descripcion', 'esTestigo', 'protocolo'];
            const sortColumn = allowedSorts.includes(sort) ? sort : 'numeroTrat';
            qb.orderBy(`t.${sortColumn}`, order);
            // Paginación
            const skip = (page - 1) * limit;
            qb.skip(skip).take(limit);
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
            const entity = yield this.repo.findOne({
                where: { id },
                relations: {
                    protocolo: true,
                    productos: { producto: true },
                },
            });
            if (!entity)
                throw new common_1.NotFoundException(`Tratamiento ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const partial = {
                numeroTrat: dto.numeroTrat,
                descripcion: dto.descripcion,
                esTestigo: dto.esTestigo,
            };
            if (dto.protocoloId !== undefined) {
                partial.protocolo = dto.protocoloId === null ? null : { id: dto.protocoloId };
            }
            yield this.repo.update({ id }, partial);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Tratamiento ${id} no encontrado`);
            return { deleted: true };
        });
    }
};
exports.TratamientosService = TratamientosService;
exports.TratamientosService = TratamientosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(tratamiento_entity_1.Tratamiento)),
    __param(2, (0, typeorm_1.InjectRepository)(protocolo_entity_1.Protocolo)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], TratamientosService);
