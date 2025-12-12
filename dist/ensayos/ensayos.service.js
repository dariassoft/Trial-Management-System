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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsayosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const laboratorio_entity_1 = require("../entities/laboratorio.entity");
const tipo_ensayo_entity_1 = require("../entities/tipo-ensayo.entity");
const protocolo_entity_1 = require("../entities/protocolo.entity");
const usuario_entity_1 = require("../entities/usuario.entity");
const cultivo_entity_1 = require("../entities/cultivo.entity");
const cultivo_variedad_entity_1 = require("../entities/cultivo-variedad.entity");
const tipo_siembra_entity_1 = require("../entities/tipo-siembra.entity");
let EnsayosService = class EnsayosService {
    constructor(req, ensayoRepo, labRepo, tipoRepo, protocoloRepo, usuarioRepo, cultivoRepo, variedadRepo, tipoSiembraRepo) {
        this.req = req;
        this.ensayoRepo = ensayoRepo;
        this.labRepo = labRepo;
        this.tipoRepo = tipoRepo;
        this.protocoloRepo = protocoloRepo;
        this.usuarioRepo = usuarioRepo;
        this.cultivoRepo = cultivoRepo;
        this.variedadRepo = variedadRepo;
        this.tipoSiembraRepo = tipoSiembraRepo;
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
            const { laboratorioId, tipoEnsayoId, protocoloId, responsableId, cultivoId, variedadId, tipoSiembraId, fechaInicio, fechaSiembra, fechaCosecha } = dto, restDto = __rest(dto, ["laboratorioId", "tipoEnsayoId", "protocoloId", "responsableId", "cultivoId", "variedadId", "tipoSiembraId", "fechaInicio", "fechaSiembra", "fechaCosecha"]);
            const entity = this.ensayoRepo.create(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, restDto), (fechaInicio && { fechaInicio: new Date(fechaInicio) })), (fechaSiembra && { fechaSiembra: new Date(fechaSiembra) })), (fechaCosecha && { fechaCosecha: new Date(fechaCosecha) })), (laboratorioId && { laboratorio: { id: laboratorioId } })), (tipoEnsayoId && { tipoEnsayo: { id: tipoEnsayoId } })), (protocoloId && { protocolo: { id: protocoloId } })), (responsableId && { responsable: { id: responsableId } })), (cultivoId && { cultivo: { id: cultivoId } })), (variedadId && { variedad: { id: variedadId } })), (tipoSiembraId && { tipoSiembra: { id: tipoSiembraId } })));
            return this.ensayoRepo.save(entity);
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const page = (_a = query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const { isInvitado, labIds } = this.auth;
            const qb = this.ensayoRepo.createQueryBuilder('e')
                .leftJoinAndSelect('e.responsable', 'responsable')
                .leftJoinAndSelect('e.laboratorio', 'laboratorio')
                .leftJoinAndSelect('e.variedad', 'variedad')
                .leftJoinAndSelect('e.cultivo', 'cultivo') // Ensure cultivo is joined for filtering
                .leftJoinAndSelect('e.tipoSiembra', 'tipoSiembra'); // Ensure tipoSiembra is joined for filtering
            if (query.q) {
                const searchTerm = `%${query.q}%`;
                qb.andWhere(`(
        LOWER(e.nombreEnsayo) LIKE LOWER(:q) OR
        LOWER(responsable.nombre) LIKE LOWER(:q) OR
        LOWER(responsable.apellido) LIKE LOWER(:q) OR
        LOWER(cultivo.nombre) LIKE LOWER(:q) OR
        LOWER(variedad.nombre) LIKE LOWER(:q) OR
        LOWER(tipoSiembra.nombre) LIKE LOWER(:q) OR
        LOWER(laboratorio.nombre) LIKE LOWER(:q) OR
        LOWER(e.status) LIKE LOWER(:q)
      )`, { q: searchTerm });
            }
            if (query.laboratorio) {
                qb.andWhere('LOWER(laboratorio.nombre) LIKE LOWER(:laboratorio)', { laboratorio: `%${query.laboratorio}%` });
            }
            if (query.variedad) {
                qb.andWhere('LOWER(variedad.nombre) LIKE LOWER(:variedad)', { variedad: `%${query.variedad}%` });
            }
            if (query.fechaSiembraStart) {
                // Use DATE() function with proper column reference
                // TypeORM will handle the column name mapping automatically
                qb.andWhere('DATE(e.fechaSiembra) >= :fechaSiembraStart', { fechaSiembraStart: query.fechaSiembraStart });
            }
            if (query.fechaSiembraEnd) {
                // Use DATE() function with proper column reference
                // TypeORM will handle the column name mapping automatically
                qb.andWhere('DATE(e.fechaSiembra) <= :fechaSiembraEnd', { fechaSiembraEnd: query.fechaSiembraEnd });
            }
            let orderByField = `e.${sort}`;
            if (sort === 'responsable.nombre') {
                orderByField = 'responsable.nombre';
            }
            else if (sort === 'laboratorio.nombre') {
                orderByField = 'laboratorio.nombre';
            }
            else if (sort === 'variedad.nombre') {
                orderByField = 'variedad.nombre';
            }
            else if (sort === 'cultivo.nombre') {
                orderByField = 'cultivo.nombre';
            }
            else if (sort === 'tipoSiembra.nombre') {
                orderByField = 'tipoSiembra.nombre';
            }
            if (isInvitado) {
                qb.leftJoin('e.tratamientos', 't')
                    .leftJoin('t.productos', 'tp')
                    .leftJoin('tp.producto', 'p')
                    .andWhere('p.laboratorio.id IN (:...labIds)', { labIds })
                    .distinct(true);
            }
            const [data, total] = yield qb
                .orderBy(orderByField, order)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const relations = ['laboratorio', 'tipoEnsayo', 'protocolo', 'responsable', 'cultivo', 'variedad', 'tipoSiembra'];
            const entity = yield this.ensayoRepo.findOne({ where: { id }, relations });
            if (!entity)
                throw new common_1.NotFoundException(`Ensayo ${id} no encontrado`);
            return entity;
        });
    }
    update(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: dtoId, laboratorioId, laboratorio, tipoEnsayoId, tipoEnsayo, protocoloId, protocolo, responsableId, responsable, cultivoId, cultivo, variedadId, variedad, tipoSiembraId, tipoSiembra, fechaInicio, fechaSiembra, fechaCosecha } = dto, restUpdateData = __rest(dto, ["id", "laboratorioId", "laboratorio", "tipoEnsayoId", "tipoEnsayo", "protocoloId", "protocolo", "responsableId", "responsable", "cultivoId", "cultivo", "variedadId", "variedad", "tipoSiembraId", "tipoSiembra", "fechaInicio", "fechaSiembra", "fechaCosecha"]);
            const partial = Object.assign({}, restUpdateData);
            if (fechaInicio !== undefined)
                partial.fechaInicio = fechaInicio ? new Date(fechaInicio) : null;
            if (fechaSiembra !== undefined)
                partial.fechaSiembra = fechaSiembra ? new Date(fechaSiembra) : null;
            if (fechaCosecha !== undefined)
                partial.fechaCosecha = fechaCosecha ? new Date(fechaCosecha) : null;
            const resolveRelationId = (objField, idField) => {
                var _a;
                if (idField !== undefined)
                    return idField;
                if (objField !== undefined)
                    return (_a = objField === null || objField === void 0 ? void 0 : objField.id) !== null && _a !== void 0 ? _a : null;
                return undefined;
            };
            const resolvedLaboratorioId = resolveRelationId(laboratorio, laboratorioId);
            if (resolvedLaboratorioId !== undefined) {
                partial.laboratorio = resolvedLaboratorioId === null ? null : { id: resolvedLaboratorioId };
            }
            const resolvedTipoEnsayoId = resolveRelationId(tipoEnsayo, tipoEnsayoId);
            if (resolvedTipoEnsayoId !== undefined) {
                partial.tipoEnsayo = resolvedTipoEnsayoId === null ? null : { id: resolvedTipoEnsayoId };
            }
            const resolvedProtocoloId = resolveRelationId(protocolo, protocoloId);
            if (resolvedProtocoloId !== undefined) {
                partial.protocolo = resolvedProtocoloId === null ? null : { id: resolvedProtocoloId };
            }
            const resolvedResponsableId = resolveRelationId(responsable, responsableId);
            if (resolvedResponsableId !== undefined) {
                partial.responsable = resolvedResponsableId === null ? null : { id: resolvedResponsableId };
            }
            const resolvedCultivoId = resolveRelationId(cultivo, cultivoId);
            if (resolvedCultivoId !== undefined) {
                partial.cultivo = resolvedCultivoId === null ? null : { id: resolvedCultivoId };
            }
            const resolvedVariedadId = resolveRelationId(variedad, variedadId);
            if (resolvedVariedadId !== undefined) {
                partial.variedad = resolvedVariedadId === null ? null : { id: resolvedVariedadId };
            }
            const resolvedTipoSiembraId = resolveRelationId(tipoSiembra, tipoSiembraId);
            if (resolvedTipoSiembraId !== undefined) {
                partial.tipoSiembra = resolvedTipoSiembraId === null ? null : { id: resolvedTipoSiembraId };
            }
            yield this.ensayoRepo.update({ id }, partial);
            return this.findOne(id);
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ensayoRepo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Ensayo ${id} no encontrado`);
            return { deleted: true };
        });
    }
};
exports.EnsayosService = EnsayosService;
exports.EnsayosService = EnsayosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(ensayo_entity_1.Ensayo)),
    __param(2, (0, typeorm_1.InjectRepository)(laboratorio_entity_1.Laboratorio)),
    __param(3, (0, typeorm_1.InjectRepository)(tipo_ensayo_entity_1.TipoEnsayo)),
    __param(4, (0, typeorm_1.InjectRepository)(protocolo_entity_1.Protocolo)),
    __param(5, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(6, (0, typeorm_1.InjectRepository)(cultivo_entity_1.Cultivo)),
    __param(7, (0, typeorm_1.InjectRepository)(cultivo_variedad_entity_1.CultivoVariedad)),
    __param(8, (0, typeorm_1.InjectRepository)(tipo_siembra_entity_1.TipoSiembra)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EnsayosService);
