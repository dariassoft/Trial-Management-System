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
exports.TiposSiembraService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tipo_siembra_entity_1 = require("../../entities/tipo-siembra.entity");
let TiposSiembraService = class TiposSiembraService {
    constructor(repository) {
        this.repository = repository;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTipo = this.repository.create(dto);
            return this.repository.save(newTipo);
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { page = 1, limit = 10, sort = 'nombre', order = 'ASC', q } = options;
            const allowedSort = ['id', 'nombre'].includes(sort) ? sort : 'nombre';
            const skip = (page - 1) * limit;
            const qTrimmed = q === null || q === void 0 ? void 0 : q.trim();
            const qb = this.repository.createQueryBuilder('t');
            if (qTrimmed) {
                qb.where('LOWER(t.nombre) LIKE LOWER(:q) OR LOWER(t.descripcion) LIKE LOWER(:q)', { q: `%${qTrimmed}%` });
            }
            const [data, total] = yield qb.orderBy(`t.${allowedSort}`, order).skip(skip).take(limit).getManyAndCount();
            return { data, meta: { total, page, limit, pageCount: Math.ceil(total / limit) } };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipo = yield this.repository.findOne({ where: { id } });
            if (!tipo)
                throw new common_1.NotFoundException(`Tipo de siembra con ID #${id} no encontrado`);
            return tipo;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipo = yield this.findOne(id);
            Object.assign(tipo, dto);
            return this.repository.save(tipo);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipo = yield this.findOne(id);
            yield this.repository.remove(tipo);
            return { deleted: true };
        });
    }
};
exports.TiposSiembraService = TiposSiembraService;
exports.TiposSiembraService = TiposSiembraService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tipo_siembra_entity_1.TipoSiembra)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TiposSiembraService);
