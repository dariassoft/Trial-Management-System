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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../entities/usuario.entity");
const rol_entity_1 = require("../entities/rol.entity");
const usuario_laboratorio_entity_1 = require("../entities/usuario-laboratorio.entity");
const laboratorio_entity_1 = require("../entities/laboratorio.entity");
function sanitizeUser(u) {
    if (!u)
        return u;
    const clone = Object.assign({}, u);
    delete clone.password;
    return clone;
}
let UsersService = class UsersService {
    constructor(dataSource, userRepo, rolRepo, ulRepo, labRepo) {
        this.dataSource = dataSource;
        this.userRepo = userRepo;
        this.rolRepo = rolRepo;
        this.ulRepo = ulRepo;
        this.labRepo = labRepo;
    }
    create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // Validar username único
            const existing = yield this.userRepo.findOne({ where: { username: dto.username } });
            if (existing)
                throw new common_1.BadRequestException('El username ya está en uso');
            const rol = yield this.rolRepo.findOne({ where: { id: dto.rolId } });
            if (!rol)
                throw new common_1.BadRequestException('Rol inválido');
            const queryRunner = this.dataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const user = this.userRepo.create({
                    username: dto.username,
                    password: dto.password, // será hasheado por hooks de entidad
                    rol,
                    nombre: (_a = dto.nombre) !== null && _a !== void 0 ? _a : null,
                    apellido: (_b = dto.apellido) !== null && _b !== void 0 ? _b : null,
                    telefono: dto.telefono,
                    fecha_nacimiento: dto.fecha_nacimiento ? new Date(dto.fecha_nacimiento) : null,
                    esta_activo: (_c = dto.esta_activo) !== null && _c !== void 0 ? _c : true,
                });
                const saved = yield queryRunner.manager.save(user);
                // Asignar laboratorios si vienen
                if (dto.laboratorioIds && dto.laboratorioIds.length > 0) {
                    // Validar existencia
                    const labs = yield this.labRepo.find({ where: { id: (0, typeorm_2.In)(dto.laboratorioIds) } });
                    const labIdsFound = new Set(labs.map((l) => l.id));
                    const notFound = dto.laboratorioIds.filter((id) => !labIdsFound.has(id));
                    if (notFound.length)
                        throw new common_1.BadRequestException(`Laboratorios inexistentes: ${notFound.join(',')}`);
                    // Evitar duplicados
                    const mappings = [];
                    for (const lab of labs) {
                        const ul = this.ulRepo.create({ usuario: saved, laboratorio: lab });
                        mappings.push(ul);
                    }
                    if (mappings.length)
                        yield queryRunner.manager.save(usuario_laboratorio_entity_1.UsuarioLaboratorio, mappings);
                }
                yield queryRunner.commitTransaction();
                return this.findOne(saved.id);
            }
            catch (e) {
                yield queryRunner.rollbackTransaction();
                throw e;
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    baseQb() {
        return this.userRepo
            .createQueryBuilder('u')
            .leftJoinAndSelect('u.rol', 'rol')
            .leftJoinAndSelect('u.laboratoriosAsignados', 'ul')
            .leftJoinAndSelect('ul.laboratorio', 'lab');
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const order = ((_c = query === null || query === void 0 ? void 0 : query.order) !== null && _c !== void 0 ? _c : 'ASC');
            // Whitelist de campos para ordenar
            const whitelistSort = new Set(['id', 'username', 'esta_activo']);
            const sort = whitelistSort.has((query === null || query === void 0 ? void 0 : query.sort) || '') ? query.sort : 'id';
            const qb = this.baseQb();
            if (query === null || query === void 0 ? void 0 : query.rolId)
                qb.andWhere('rol.id = :rolId', { rolId: query.rolId });
            if (typeof (query === null || query === void 0 ? void 0 : query.activo) === 'boolean')
                qb.andWhere('u.esta_activo = :activo', { activo: query.activo });
            if (query === null || query === void 0 ? void 0 : query.q) {
                qb.andWhere('(u.username LIKE :q OR u.nombre LIKE :q OR u.apellido LIKE :q OR u.telefono LIKE :q)', {
                    q: `%${query.q}%`,
                });
            }
            const [rows, total] = yield qb
                .orderBy(`u.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return {
                data: rows.map(sanitizeUser),
                meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) },
            };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findOne({
                where: { id },
                relations: ['rol', 'laboratoriosAsignados', 'laboratoriosAsignados.laboratorio'],
            });
            if (!user)
                throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
            return sanitizeUser(user);
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = yield this.userRepo.findOne({ where: { id }, relations: ['rol'] });
            if (!user)
                throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
            // No permitir cambiar username desde este endpoint (opcional: podrías permitirlo validando duplicados)
            // (dto as any).username = undefined;
            if (dto.rolId !== undefined) {
                const rol = yield this.rolRepo.findOne({ where: { id: dto.rolId } });
                if (!rol)
                    throw new common_1.BadRequestException('Rol inválido');
                user.rol = rol;
            }
            if (dto.password !== undefined) {
                user.password = dto.password; // será re-hasheado por hook @BeforeUpdate
            }
            if (dto.nombre !== undefined)
                user.nombre = (_a = dto.nombre) !== null && _a !== void 0 ? _a : null;
            if (dto.apellido !== undefined)
                user.apellido = (_b = dto.apellido) !== null && _b !== void 0 ? _b : null;
            if (dto.telefono !== undefined)
                user.telefono = dto.telefono;
            if (dto.fecha_nacimiento !== undefined)
                user.fecha_nacimiento = dto.fecha_nacimiento ? new Date(dto.fecha_nacimiento) : null;
            if (dto.esta_activo !== undefined)
                user.esta_activo = dto.esta_activo;
            const saved = yield this.userRepo.save(user); // usa hooks
            return this.findOne(saved.id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.userRepo.delete({ id });
            if (!res.affected)
                throw new common_1.NotFoundException(`Usuario ${id} no encontrado`);
            return { deleted: true };
        });
    }
    addLaboratorios(userId, laboratorioIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findOne({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException(`Usuario ${userId} no encontrado`);
            // Validar labs
            const labs = yield this.labRepo.find({ where: { id: (0, typeorm_2.In)(laboratorioIds) } });
            const found = new Set(labs.map((l) => l.id));
            const missing = laboratorioIds.filter((id) => !found.has(id));
            if (missing.length)
                throw new common_1.BadRequestException(`Laboratorios inexistentes: ${missing.join(',')}`);
            const queryRunner = this.dataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                // Recuperar existentes para evitar duplicados
                const existing = yield this.ulRepo.find({ where: { usuario: { id: userId } }, relations: { laboratorio: true } });
                const existingIds = new Set(existing.map((m) => m.laboratorio.id));
                const toCreate = [];
                for (const lab of labs) {
                    if (!existingIds.has(lab.id)) {
                        toCreate.push(this.ulRepo.create({ usuario: user, laboratorio: lab }));
                    }
                }
                if (toCreate.length)
                    yield queryRunner.manager.save(usuario_laboratorio_entity_1.UsuarioLaboratorio, toCreate);
                yield queryRunner.commitTransaction();
            }
            catch (e) {
                yield queryRunner.rollbackTransaction();
                throw e;
            }
            finally {
                yield queryRunner.release();
            }
            return this.findOne(userId);
        });
    }
    removeLaboratorio(userId, labId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Ensure user exists
            const user = yield this.userRepo.findOne({ where: { id: userId } });
            if (!user)
                throw new common_1.NotFoundException(`Usuario ${userId} no encontrado`);
            const res = yield this.ulRepo.delete({ usuario: { id: userId }, laboratorio: { id: labId } });
            if (!res.affected)
                throw new common_1.NotFoundException(`Asignación usuario-laboratorio no encontrada`);
            return { deleted: true };
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(2, (0, typeorm_1.InjectRepository)(rol_entity_1.Rol)),
    __param(3, (0, typeorm_1.InjectRepository)(usuario_laboratorio_entity_1.UsuarioLaboratorio)),
    __param(4, (0, typeorm_1.InjectRepository)(laboratorio_entity_1.Laboratorio)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
