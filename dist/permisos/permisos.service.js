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
exports.PermisosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permiso_entity_1 = require("../entities/permiso.entity");
const rol_entity_1 = require("../entities/rol.entity");
let PermisosService = class PermisosService {
    constructor(permisoRepository, rolRepository) {
        this.permisoRepository = permisoRepository;
        this.rolRepository = rolRepository;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            // Verificar que el rol existe
            const rol = yield this.rolRepository.findOne({ where: { id: dto.rol_id } });
            if (!rol) {
                throw new common_1.NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);
            }
            // Verificar que no existe un permiso duplicado
            const existente = yield this.permisoRepository.findOne({
                where: {
                    rol_id: dto.rol_id,
                    recurso: dto.recurso,
                    accion: dto.accion,
                },
            });
            if (existente) {
                throw new common_1.BadRequestException(`El rol ya tiene permiso para ${dto.accion} en ${dto.recurso}`);
            }
            const permiso = this.permisoRepository.create({
                rol_id: dto.rol_id,
                recurso: dto.recurso,
                accion: dto.accion,
                descripcion: (_a = dto.descripcion) !== null && _a !== void 0 ? _a : null,
                activo: (_b = dto.activo) !== null && _b !== void 0 ? _b : true,
            });
            return this.permisoRepository.save(permiso);
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query === null || query === void 0 ? void 0 : query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query === null || query === void 0 ? void 0 : query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const qb = this.permisoRepository
                .createQueryBuilder('p')
                .leftJoinAndSelect('p.rol', 'rol');
            if (query === null || query === void 0 ? void 0 : query.rol_id) {
                qb.andWhere('p.rol_id = :rol_id', { rol_id: query.rol_id });
            }
            if (query === null || query === void 0 ? void 0 : query.recurso) {
                qb.andWhere('p.recurso LIKE :recurso', { recurso: `%${query.recurso}%` });
            }
            if (query === null || query === void 0 ? void 0 : query.accion) {
                qb.andWhere('p.accion = :accion', { accion: query.accion });
            }
            const [data, total] = yield qb
                .orderBy(`p.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                data,
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
            const permiso = yield this.permisoRepository.findOne({
                where: { id },
                relations: { rol: true },
            });
            if (!permiso) {
                throw new common_1.NotFoundException(`Permiso ${id} no encontrado`);
            }
            return permiso;
        });
    }
    findByRolId(rol_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.permisoRepository.find({
                where: { rol_id },
                relations: { rol: true },
            });
        });
    }
    hasPermiso(rol_id, recurso, accion) {
        return __awaiter(this, void 0, void 0, function* () {
            const permiso = yield this.permisoRepository.findOne({
                where: {
                    rol_id,
                    recurso,
                    accion,
                    activo: true,
                },
            });
            return !!permiso;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const permiso = yield this.findOne(id);
            if (dto.rol_id && dto.rol_id !== permiso.rol_id) {
                const rol = yield this.rolRepository.findOne({
                    where: { id: dto.rol_id },
                });
                if (!rol) {
                    throw new common_1.NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);
                }
            }
            // Actualizar manualmente en lugar de preload
            if (dto.rol_id !== undefined)
                permiso.rol_id = dto.rol_id;
            if (dto.recurso !== undefined)
                permiso.recurso = dto.recurso;
            if (dto.accion !== undefined)
                permiso.accion = dto.accion;
            if (dto.descripcion !== undefined)
                permiso.descripcion = dto.descripcion;
            if (dto.activo !== undefined)
                permiso.activo = dto.activo;
            return this.permisoRepository.save(permiso);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permiso = yield this.findOne(id);
            return this.permisoRepository.remove(permiso);
        });
    }
    asignarPermisosDefault(rol_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const rol = yield this.rolRepository.findOne({ where: { id: rol_id } });
            if (!rol) {
                throw new common_1.NotFoundException(`Rol con ID ${rol_id} no encontrado`);
            }
            // Definir permisos por defecto según el rol
            const permisosDefault = this.getPermisosDefault(rol.nombre);
            const permisosCreados = [];
            for (const { recurso, acciones } of permisosDefault) {
                for (const accion of acciones) {
                    const existe = yield this.permisoRepository.findOne({
                        where: { rol_id, recurso, accion },
                    });
                    if (!existe) {
                        const permiso = this.permisoRepository.create({
                            rol_id,
                            recurso,
                            accion,
                            activo: true,
                        });
                        const saved = yield this.permisoRepository.save(permiso);
                        permisosCreados.push(saved);
                    }
                }
            }
            return permisosCreados;
        });
    }
    initAllPermisosDefault() {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener todos los roles
            const roles = yield this.rolRepository.find();
            if (roles.length === 0) {
                throw new common_1.NotFoundException('No hay roles en la base de datos');
            }
            let totalPermisosCreados = 0;
            // Para cada rol, asignar permisos por defecto
            for (const rol of roles) {
                const permisosCreados = yield this.asignarPermisosDefault(rol.id);
                totalPermisosCreados += permisosCreados.length;
            }
            return {
                message: 'Permisos inicializados exitosamente',
                totalPermisosCreados,
                rolesProcessados: roles.length,
            };
        });
    }
    getPermisosDefault(rolNombre) {
        const permisosMap = {
            'Superadministrador': [
                {
                    recurso: 'laboratorios',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                        permiso_entity_1.AccionPermiso.EXPORTAR,
                    ],
                },
                {
                    recurso: 'usuarios',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                        permiso_entity_1.AccionPermiso.EXPORTAR,
                    ],
                },
                {
                    recurso: 'roles',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'permisos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'productos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                        permiso_entity_1.AccionPermiso.EXPORTAR,
                    ],
                },
                {
                    recurso: 'cultivos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                        permiso_entity_1.AccionPermiso.EXPORTAR,
                    ],
                },
                {
                    recurso: 'variedades',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'tipos-ensayo',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'tipos-siembra',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'ensayos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                        permiso_entity_1.AccionPermiso.EXPORTAR,
                    ],
                },
            ],
            'Administrador': [
                {
                    recurso: 'laboratorios',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'usuarios',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                    ],
                },
                {
                    recurso: 'permisos',
                    acciones: [permiso_entity_1.AccionPermiso.LISTAR, permiso_entity_1.AccionPermiso.VER],
                },
                {
                    recurso: 'productos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'cultivos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'variedades',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'tipos-ensayo',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'tipos-siembra',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                    ],
                },
                {
                    recurso: 'ensayos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.ELIMINAR,
                        permiso_entity_1.AccionPermiso.EXPORTAR,
                    ],
                },
            ],
            'Manager': [
                {
                    recurso: 'productos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                    ],
                },
                {
                    recurso: 'ensayos',
                    acciones: [
                        permiso_entity_1.AccionPermiso.LISTAR,
                        permiso_entity_1.AccionPermiso.VER,
                        permiso_entity_1.AccionPermiso.CREAR,
                        permiso_entity_1.AccionPermiso.EDITAR,
                        permiso_entity_1.AccionPermiso.EXPORTAR,
                    ],
                },
                {
                    recurso: 'cultivos',
                    acciones: [permiso_entity_1.AccionPermiso.LISTAR, permiso_entity_1.AccionPermiso.VER],
                },
            ],
            'Tecnico': [
                {
                    recurso: 'ensayos',
                    acciones: [permiso_entity_1.AccionPermiso.LISTAR, permiso_entity_1.AccionPermiso.VER],
                },
                {
                    recurso: 'productos',
                    acciones: [permiso_entity_1.AccionPermiso.LISTAR, permiso_entity_1.AccionPermiso.VER],
                },
                {
                    recurso: 'cultivos',
                    acciones: [permiso_entity_1.AccionPermiso.LISTAR, permiso_entity_1.AccionPermiso.VER],
                },
            ],
            'Invitado': [
                {
                    recurso: 'ensayos',
                    acciones: [permiso_entity_1.AccionPermiso.LISTAR, permiso_entity_1.AccionPermiso.VER],
                },
            ],
        };
        return permisosMap[rolNombre] || [];
    }
};
exports.PermisosService = PermisosService;
exports.PermisosService = PermisosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permiso_entity_1.Permiso)),
    __param(1, (0, typeorm_1.InjectRepository)(rol_entity_1.Rol)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PermisosService);
