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
exports.ProtocolosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const protocolo_entity_1 = require("../entities/protocolo.entity");
let ProtocolosService = class ProtocolosService {
    constructor(protocoloRepo) {
        this.protocoloRepo = protocoloRepo;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProtocolo = this.protocoloRepo.create(dto);
            return this.protocoloRepo.save(newProtocolo);
        });
    }
    /**
     * Obtener lista de protocolos con paginación, búsqueda y filtros
     */
    findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPaginated = (params === null || params === void 0 ? void 0 : params.page) !== undefined;
            const page = (params === null || params === void 0 ? void 0 : params.page) ? parseInt(params.page) : 1;
            const limit = (params === null || params === void 0 ? void 0 : params.limit) ? parseInt(params.limit) : 10;
            const sort = (params === null || params === void 0 ? void 0 : params.sort) || 'nombre';
            const order = ((params === null || params === void 0 ? void 0 : params.order) || 'ASC');
            const searchQuery = (params === null || params === void 0 ? void 0 : params.q) || '';
            // Validación de parámetros
            const validPage = Math.max(1, page);
            const validLimit = Math.max(1, Math.min(100, limit));
            const validSort = ['id', 'nombre', 'descripcion', 'createdAt'].includes(sort) ? sort : 'nombre';
            console.log('🔍 findAll() Búsqueda de protocolos:', { searchQuery, sort: validSort, order, page: validPage, limit: validLimit, isPaginated });
            // ============================================
            // QUERY 1: Contar total con filtros
            // ============================================
            const countQb = this.protocoloRepo.createQueryBuilder('p');
            if (searchQuery) {
                console.log('🔎 Aplicando filtro WHERE para búsqueda:', searchQuery);
                countQb.where('LOWER(p.nombre) LIKE LOWER(:q)', { q: `%${searchQuery}%` })
                    .orWhere('LOWER(p.descripcion) LIKE LOWER(:q)', { q: `%${searchQuery}%` });
            }
            const total = yield countQb.getCount();
            const pageCount = isPaginated ? Math.ceil(total / validLimit) : 1;
            console.log('📊 Total registros después de filtrar:', total);
            // ============================================
            // QUERY 2: Obtener datos con filtros + relaciones + orden + paginación
            // ============================================
            const dataQb = this.protocoloRepo.createQueryBuilder('p');
            // Aplicar los MISMOS filtros de búsqueda
            if (searchQuery) {
                dataQb.where('LOWER(p.nombre) LIKE LOWER(:q)', { q: `%${searchQuery}%` })
                    .orWhere('LOWER(p.descripcion) LIKE LOWER(:q)', { q: `%${searchQuery}%` });
            }
            // Cargar relaciones
            dataQb.leftJoinAndSelect('p.tratamientos', 'tratamientos');
            // Aplicar ordenamiento
            console.log(`📊 Aplicando orden: p.${validSort} ${order}`);
            dataQb.orderBy(`p.${validSort}`, order);
            // Aplicar paginación si se especificó
            if (isPaginated) {
                const offset = (validPage - 1) * validLimit;
                console.log(`📄 Paginación: offset=${offset}, limit=${validLimit}`);
                dataQb.skip(offset).take(validLimit);
            }
            const data = yield dataQb.getMany();
            console.log('✅ Protocolos devueltos:', data.length);
            return {
                data,
                meta: {
                    total,
                    page: isPaginated ? validPage : 1,
                    limit: isPaginated ? validLimit : total,
                    pageCount,
                },
            };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocolo = yield this.protocoloRepo.findOne({
                where: { id },
                relations: ['tratamientos'],
            });
            if (!protocolo) {
                throw new common_1.NotFoundException(`Protocolo con ID ${id} no encontrado.`);
            }
            return protocolo;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const protocolo = yield this.findOne(id);
            this.protocoloRepo.merge(protocolo, dto);
            return this.protocoloRepo.save(protocolo);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.findOne(id);
            yield this.protocoloRepo.delete(id);
            return { deleted: true };
        });
    }
};
exports.ProtocolosService = ProtocolosService;
exports.ProtocolosService = ProtocolosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(protocolo_entity_1.Protocolo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProtocolosService);
