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
exports.BloquesService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bloque_entity_1 = require("../entities/bloque.entity");
const ensayo_entity_1 = require("../entities/ensayo.entity");
let BloquesService = class BloquesService {
    constructor(req, repo, ensayoRepo) {
        this.req = req;
        this.repo = repo;
        this.ensayoRepo = ensayoRepo;
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
            // Validar que el nombre no esté vacío
            if (!dto.nombreBloque || !dto.nombreBloque.trim()) {
                throw new common_1.BadRequestException('nombreBloque es requerido');
            }
            // Validar que ensayoId esté presente
            if (!dto.ensayoId) {
                throw new common_1.BadRequestException('ensayoId es requerido');
            }
            // Obtener ensayo para validar cantidad de bloques
            const ensayo = yield this.ensayoRepo.findOne({ where: { id: dto.ensayoId } });
            if (!ensayo) {
                throw new common_1.NotFoundException(`Ensayo ${dto.ensayoId} no encontrado`);
            }
            if (ensayo.cantBloques) {
                const currentBlocksCount = yield this.repo.count({
                    where: { ensayo: { id: dto.ensayoId } },
                });
                if (currentBlocksCount >= ensayo.cantBloques) {
                    throw new common_1.BadRequestException(`Límite alcanzado: Ya se han creado todos los bloques definidos en el ensayo (${ensayo.cantBloques}).`);
                }
            }
            // Verificar si ya existe un bloque con este nombre para este ensayo
            const existente = yield this.repo.findOne({
                where: {
                    ensayo: { id: dto.ensayoId },
                    nombreBloque: dto.nombreBloque.trim(),
                },
            });
            if (existente) {
                throw new common_1.ConflictException(`Ya existe un bloque con el nombre "${dto.nombreBloque}" para este ensayo`);
            }
            try {
                const entity = this.repo.create({
                    ensayo: { id: dto.ensayoId },
                    nombreBloque: dto.nombreBloque.trim(),
                });
                return yield this.repo.save(entity);
            }
            catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new common_1.ConflictException(`Ya existe un bloque con el nombre "${dto.nombreBloque}" para este ensayo`);
                }
                throw error;
            }
        });
    }
    findAll(ensayoId) {
        const { isInvitado, labIds } = this.auth;
        // Relaciones del ensayo a cargar (para tener codigoLabor, protocolo, laboratorio, tipoEnsayo)
        const ensayoRelations = {
            ensayo: {
                protocolo: true,
                laboratorio: true,
                tipoEnsayo: true,
            },
        };
        // Si viene ensayoId, filtrar por ese ensayo
        if (ensayoId) {
            if (!isInvitado) {
                return this.repo.find({
                    where: { ensayo: { id: ensayoId } },
                    relations: ensayoRelations,
                    order: { nombreBloque: 'ASC' },
                });
            }
            const qb = this.repo.createQueryBuilder('b')
                .leftJoinAndSelect('b.ensayo', 'e')
                .leftJoinAndSelect('e.protocolo', 'protocolo')
                .leftJoinAndSelect('e.laboratorio', 'laboratorio')
                .leftJoinAndSelect('e.tipoEnsayo', 'tipoEnsayo')
                .leftJoin('e.tratamientos', 't')
                .leftJoin('t.productos', 'tp')
                .leftJoin('tp.producto', 'p')
                .leftJoin('p.laboratorio', 'l')
                .where('b.ensayo.id = :ensayoId', { ensayoId })
                .andWhere('l.id IN (:...labIds)', { labIds })
                .orderBy('b.nombreBloque', 'ASC')
                .distinct(true);
            return qb.getMany();
        }
        // Si no viene ensayoId, traer todos (comportamiento original)
        if (!isInvitado) {
            return this.repo.find({ relations: ensayoRelations, order: { nombreBloque: 'ASC' } });
        }
        const qb = this.repo.createQueryBuilder('b')
            .leftJoinAndSelect('b.ensayo', 'e')
            .leftJoinAndSelect('e.protocolo', 'protocolo')
            .leftJoinAndSelect('e.laboratorio', 'laboratorio')
            .leftJoinAndSelect('e.tipoEnsayo', 'tipoEnsayo')
            .leftJoin('e.tratamientos', 't')
            .leftJoin('t.productos', 'tp')
            .leftJoin('tp.producto', 'p')
            .leftJoin('p.laboratorio', 'l')
            .where('l.id IN (:...labIds)', { labIds })
            .orderBy('b.nombreBloque', 'ASC')
            .distinct(true);
        return qb.getMany();
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                const entity = yield this.repo.findOne({ where: { id }, relations: { ensayo: true } });
                if (!entity)
                    throw new common_1.NotFoundException(`Bloque ${id} no encontrado`);
                return entity;
            }
            const qb = this.repo.createQueryBuilder('b')
                .leftJoinAndSelect('b.ensayo', 'e')
                .leftJoin('e.tratamientos', 't')
                .leftJoin('t.productos', 'tp')
                .leftJoin('tp.producto', 'p')
                .leftJoin('p.laboratorio', 'l')
                .where('b.id = :id', { id })
                .andWhere('l.id IN (:...labIds)', { labIds })
                .distinct(true);
            const entity = yield qb.getOne();
            if (!entity)
                throw new common_1.NotFoundException(`Bloque ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const partial = { nombreBloque: dto.nombreBloque };
            if (dto.ensayoId !== undefined) {
                partial.ensayo = { id: dto.ensayoId };
            }
            yield this.repo.update({ id }, partial);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Bloque ${id} no encontrado`);
            return { deleted: true };
        });
    }
};
exports.BloquesService = BloquesService;
exports.BloquesService = BloquesService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(bloque_entity_1.Bloque)),
    __param(2, (0, typeorm_1.InjectRepository)(ensayo_entity_1.Ensayo)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], BloquesService);
