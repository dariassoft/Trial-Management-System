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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("../entities/producto.entity");
let ProductosService = class ProductosService {
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
            const entity = this.repo.create({
                nombre_comercial: dto.nombre_comercial,
                principio_activo: dto.principio_activo,
                formulacion: dto.formulacion,
                laboratorio: dto.laboratorioId ? { id: dto.laboratorioId } : undefined,
            });
            return this.repo.save(entity);
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
            const qb = this.repo.createQueryBuilder('p')
                .leftJoinAndSelect('p.laboratorio', 'laboratorio');
            if (query === null || query === void 0 ? void 0 : query.laboratorioId)
                qb.andWhere('laboratorio.id = :laboratorioId', { laboratorioId: query.laboratorioId });
            if (query === null || query === void 0 ? void 0 : query.q)
                qb.andWhere('(p.nombre_comercial LIKE :q OR p.principio_activo LIKE :q)', { q: `%${query.q}%` });
            if (isInvitado)
                qb.andWhere('laboratorio.id IN (:...labIds)', { labIds });
            const [data, total] = yield qb
                .orderBy(`p.${sort}`, order)
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
                const entity = yield this.repo.findOne({ where: { id }, relations: { laboratorio: true } });
                if (!entity)
                    throw new common_1.NotFoundException(`Producto ${id} no encontrado`);
                return entity;
            }
            const qb = this.repo.createQueryBuilder('p')
                .leftJoinAndSelect('p.laboratorio', 'laboratorio')
                .where('p.id = :id', { id })
                .andWhere('laboratorio.id IN (:...labIds)', { labIds });
            const entity = yield qb.getOne();
            if (!entity)
                throw new common_1.NotFoundException(`Producto ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const partial = {
                nombre_comercial: dto.nombre_comercial,
                principio_activo: dto.principio_activo,
                formulacion: dto.formulacion,
            };
            if (dto.laboratorioId !== undefined) {
                partial.laboratorio = dto.laboratorioId === null ? null : { id: dto.laboratorioId };
            }
            yield this.repo.update({ id }, partial);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Producto ${id} no encontrado`);
            return { deleted: true };
        });
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], ProductosService);
