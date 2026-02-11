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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rol_entity_1 = require("../entities/rol.entity");
let RolesService = class RolesService {
    constructor(repo) {
        this.repo = repo;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Validar que el nombre sea único
            const existing = yield this.repo.findOne({ where: { nombre: dto.nombre } });
            if (existing) {
                throw new common_1.BadRequestException('El nombre del rol ya existe');
            }
            const rol = this.repo.create({
                nombre: dto.nombre,
                descripcion: (_a = dto.descripcion) !== null && _a !== void 0 ? _a : null,
            });
            return this.repo.save(rol);
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query === null || query === void 0 ? void 0 : query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query === null || query === void 0 ? void 0 : query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const qb = this.repo
                .createQueryBuilder('r')
                .leftJoinAndSelect('r.usuarios', 'u');
            // Búsqueda por nombre o descripción
            if (query === null || query === void 0 ? void 0 : query.q) {
                qb.where('r.nombre_rol LIKE :q OR r.descripcion LIKE :q', {
                    q: `%${query.q}%`,
                });
            }
            qb.orderBy(`r.${sort}`, order);
            const [data, total] = yield qb
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            // Enriquecer con contador de usuarios
            const enriched = data.map((rol) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, rol), { usuariosCount: (_b = (_a = rol.usuarios) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 }));
            });
            return {
                data: enriched,
                meta: {
                    total,
                    page,
                    limit,
                    pageCount: Math.max(1, Math.ceil(total / limit)),
                },
            };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const rol = yield this.repo
                .createQueryBuilder('r')
                .leftJoinAndSelect('r.usuarios', 'u')
                .where('r.rol_id = :id', { id })
                .getOne();
            if (!rol) {
                throw new common_1.NotFoundException(`Rol con ID ${id} no encontrado`);
            }
            return Object.assign(Object.assign({}, rol), { usuariosCount: (_b = (_a = rol.usuarios) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 });
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const rol = yield this.repo.findOne({ where: { id } });
            if (!rol) {
                throw new common_1.NotFoundException(`Rol con ID ${id} no encontrado`);
            }
            // Validar unicidad del nombre si se intenta cambiar
            if (dto.nombre && dto.nombre !== rol.nombre) {
                const existing = yield this.repo.findOne({ where: { nombre: dto.nombre } });
                if (existing) {
                    throw new common_1.BadRequestException('El nombre del rol ya existe');
                }
            }
            if (dto.nombre)
                rol.nombre = dto.nombre;
            if (dto.descripcion !== undefined)
                rol.descripcion = (_a = dto.descripcion) !== null && _a !== void 0 ? _a : null;
            return this.repo.save(rol);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rol = yield this.repo.findOne({
                where: { id },
                relations: ['usuarios'],
            });
            if (!rol) {
                throw new common_1.NotFoundException(`Rol con ID ${id} no encontrado`);
            }
            // Validar que no tenga usuarios asignados
            if (rol.usuarios && rol.usuarios.length > 0) {
                throw new common_1.BadRequestException(`No se puede eliminar el rol con ${rol.usuarios.length} usuario(s) asignado(s)`);
            }
            yield this.repo.delete(id);
            return { deleted: true };
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rol_entity_1.Rol)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolesService);
