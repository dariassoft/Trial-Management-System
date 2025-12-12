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
exports.MomentosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const momento_evaluacion_entity_1 = require("../entities/momento-evaluacion.entity");
let MomentosService = class MomentosService {
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
        const entity = this.repo.create({
            aplicacion: { id: dto.aplicacionId },
            nombreMomento: dto.nombreMomento,
            diasDespuesAplicacion: dto.diasDespuesAplicacion,
            fechaEvaluacion: dto.fechaEvaluacion ? new Date(dto.fechaEvaluacion) : undefined,
        });
        return this.repo.save(entity);
    }
    findAll() {
        const { isInvitado, labIds } = this.auth;
        if (!isInvitado) {
            return this.repo.find({ relations: { aplicacion: true } });
        }
        const qb = this.repo.createQueryBuilder('m')
            .leftJoinAndSelect('m.aplicacion', 'a')
            .leftJoin('a.ensayo', 'e')
            .leftJoin('e.tratamientos', 't')
            .leftJoin('t.productos', 'tp')
            .leftJoin('tp.producto', 'p')
            .leftJoin('p.laboratorio', 'l')
            .where('l.id IN (:...labIds)', { labIds })
            .distinct(true);
        return qb.getMany();
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                const entity = yield this.repo.findOne({ where: { id }, relations: { aplicacion: true } });
                if (!entity)
                    throw new common_1.NotFoundException(`Momento ${id} no encontrado`);
                return entity;
            }
            const qb = this.repo.createQueryBuilder('m')
                .leftJoinAndSelect('m.aplicacion', 'a')
                .leftJoin('a.ensayo', 'e')
                .leftJoin('e.tratamientos', 't')
                .leftJoin('t.productos', 'tp')
                .leftJoin('tp.producto', 'p')
                .leftJoin('p.laboratorio', 'l')
                .where('m.id = :id', { id })
                .andWhere('l.id IN (:...labIds)', { labIds })
                .distinct(true);
            const entity = yield qb.getOne();
            if (!entity)
                throw new common_1.NotFoundException(`Momento ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const partial = {
                nombreMomento: dto.nombreMomento,
                diasDespuesAplicacion: dto.diasDespuesAplicacion,
                fechaEvaluacion: dto.fechaEvaluacion ? new Date(dto.fechaEvaluacion) : undefined,
            };
            if (dto.aplicacionId !== undefined)
                partial.aplicacion = { id: dto.aplicacionId };
            yield this.repo.update({ id }, partial);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Momento ${id} no encontrado`);
            return { deleted: true };
        });
    }
};
exports.MomentosService = MomentosService;
exports.MomentosService = MomentosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(momento_evaluacion_entity_1.MomentoEvaluacion)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository])
], MomentosService);
