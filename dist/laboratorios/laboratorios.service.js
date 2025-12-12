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
exports.LaboratoriosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const laboratorio_entity_1 = require("../entities/laboratorio.entity");
let LaboratoriosService = class LaboratoriosService {
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
        const entity = this.repo.create({ nombre: dto.nombre });
        return this.repo.save(entity);
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query === null || query === void 0 ? void 0 : query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query === null || query === void 0 ? void 0 : query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const { isInvitado, labIds } = this.auth;
            const qb = this.repo.createQueryBuilder('l');
            if (query === null || query === void 0 ? void 0 : query.q)
                qb.where('l.nombre LIKE :q', { q: `%${query.q}%` });
            if (isInvitado)
                qb.andWhere('l.id IN (:...labIds)', { labIds });
            const [data, total] = yield qb
                .orderBy(`l.${sort}`, order)
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
                const entity = yield this.repo.findOne({ where: { id } });
                if (!entity)
                    throw new common_1.NotFoundException(`Laboratorio ${id} no encontrado`);
                return entity;
            }
            const entity = yield this.repo.findOne({ where: { id: id } });
            if (!entity || !labIds.includes(entity.id))
                throw new common_1.NotFoundException(`Laboratorio ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.update({ id }, dto);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Laboratorio ${id} no encontrado`);
            return { deleted: true };
        });
    }
};
exports.LaboratoriosService = LaboratoriosService;
exports.LaboratoriosService = LaboratoriosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(laboratorio_entity_1.Laboratorio)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], LaboratoriosService);
