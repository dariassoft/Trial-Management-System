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
exports.CultivosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cultivo_entity_1 = require("../../entities/cultivo.entity");
const cultivo_variedad_entity_1 = require("../../entities/cultivo-variedad.entity");
let CultivosService = class CultivosService {
    constructor(cultivoRepository, variedadRepository) {
        this.cultivoRepository = cultivoRepository;
        this.variedadRepository = variedadRepository;
    }
    create(createCultivoDto) {
        const cultivo = this.cultivoRepository.create(createCultivoDto);
        return this.cultivoRepository.save(cultivo);
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const { page = 1, limit = 10, sort = 'nombre', order = 'ASC', q } = options;
            const allowedSort = ['id', 'nombre', 'ciclo_vegetativo'].includes(sort) ? sort : 'nombre';
            const skip = (page - 1) * limit;
            const qTrimmed = q === null || q === void 0 ? void 0 : q.trim();
            const qb = this.cultivoRepository.createQueryBuilder('c');
            if (qTrimmed) {
                qb.where('LOWER(c.nombre) LIKE LOWER(:q) OR LOWER(c.descripcion) LIKE LOWER(:q)', { q: `%${qTrimmed}%` });
            }
            const total = yield qb.getCount();
            const data = yield qb.orderBy(`c.${allowedSort}`, order).skip(skip).take(limit).getMany();
            return { data, meta: { total, page, limit, pageCount: Math.ceil(total / limit) } };
        });
    }
    findOne(id) {
        return this.cultivoRepository.findOne({ where: { id } });
    }
    findVariedadesPorCultivo(cultivo_id) {
        return this.variedadRepository.find({ where: { cultivo_id }, order: { nombre: 'ASC' } });
    }
    update(id, updateCultivoDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const cultivo = yield this.cultivoRepository.preload(Object.assign({ id }, updateCultivoDto));
            if (!cultivo)
                throw new common_1.NotFoundException(`Cultivo con ID #${id} no encontrado`);
            return this.cultivoRepository.save(cultivo);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cultivo = yield this.findOne(id);
            if (!cultivo)
                throw new common_1.NotFoundException(`Cultivo con ID #${id} no encontrado`);
            return this.cultivoRepository.remove(cultivo);
        });
    }
};
exports.CultivosService = CultivosService;
exports.CultivosService = CultivosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cultivo_entity_1.Cultivo)),
    __param(1, (0, typeorm_1.InjectRepository)(cultivo_variedad_entity_1.CultivoVariedad)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CultivosService);
