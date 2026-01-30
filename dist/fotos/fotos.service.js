"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.FotosService = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rol_entity_1 = require("../entities/rol.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const foto_registro_entity_1 = require("../entities/foto-registro.entity");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const path = __importStar(require("path"));
let FotosService = class FotosService {
    constructor(req, fotoRepo, visitaRepo) {
        this.req = req;
        this.fotoRepo = fotoRepo;
        this.visitaRepo = visitaRepo;
    }
    get auth() {
        var _a;
        const user = (_a = this.req) === null || _a === void 0 ? void 0 : _a.user;
        const isInvitado = (user === null || user === void 0 ? void 0 : user.rol) === rol_entity_1.Role.INVITADO;
        const labIds = ((user === null || user === void 0 ? void 0 : user.lab_ids) || []);
        return { isInvitado, labIds };
    }
    create(idVisita, file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // Cargar visita con relaciones para obtener info de parcela, bloque y ensayo
            const visita = yield this.visitaRepo.findOne({
                where: { id: idVisita },
                relations: ['parcela', 'parcela.bloque', 'parcela.ensayo', 'momento'],
            });
            if (!visita)
                throw new common_1.NotFoundException(`Visita (DatosCampo) ${idVisita} no encontrada`);
            // Extraer información para el nombre descriptivo
            const parcela = visita.parcela;
            const bloque = parcela === null || parcela === void 0 ? void 0 : parcela.bloque;
            const ensayo = parcela === null || parcela === void 0 ? void 0 : parcela.ensayo;
            const momento = visita.momento;
            // Construir nombre descriptivo del archivo
            // Formato: ensayo{id}_bloque{nombre}_parcela{nombre}_DDA{dias}_{timestamp}.{ext}
            const ensayoId = (ensayo === null || ensayo === void 0 ? void 0 : ensayo.id) || 0;
            const bloqueNombre = ((bloque === null || bloque === void 0 ? void 0 : bloque.nombreBloque) || 'X').replace(/[^a-zA-Z0-9]/g, '');
            const parcelaNombre = ((parcela === null || parcela === void 0 ? void 0 : parcela.nombreParcela) || 'X').replace(/[^a-zA-Z0-9\-\.]/g, '_');
            const dda = (_a = momento === null || momento === void 0 ? void 0 : momento.diasDespuesAplicacion) !== null && _a !== void 0 ? _a : 0;
            const timestamp = Date.now();
            const ext = path.extname(file.originalname) || `.${((_b = file.mimetype) === null || _b === void 0 ? void 0 : _b.split('/')[1]) || 'bin'}`;
            const isVideo = (_c = file.mimetype) === null || _c === void 0 ? void 0 : _c.startsWith('video/');
            const tipo = isVideo ? 'video' : 'foto';
            const nuevoNombre = `${tipo}_E${ensayoId}_B${bloqueNombre}_${parcelaNombre}_DDA${dda}_${timestamp}${ext}`;
            // Estructura de carpetas: /uploads/ensayo_{id}/bloque_{nombre}/
            const uploadsRoot = path.join(process.cwd(), 'uploads');
            const ensayoDir = path.join(uploadsRoot, `ensayo_${ensayoId}`);
            const bloqueDir = path.join(ensayoDir, `bloque_${bloqueNombre}`);
            // Crear carpetas si no existen
            const fs = require('fs');
            if (!fs.existsSync(ensayoDir))
                fs.mkdirSync(ensayoDir, { recursive: true });
            if (!fs.existsSync(bloqueDir))
                fs.mkdirSync(bloqueDir, { recursive: true });
            // Mover archivo a la nueva ubicación
            const nuevoPath = path.join(bloqueDir, nuevoNombre);
            fs.renameSync(file.path, nuevoPath);
            // Construir ruta relativa para servir vía HTTP
            const relative = path.relative(uploadsRoot, nuevoPath).split(path.sep).join('/');
            const file_path = `/uploads/${relative}`;
            const foto = this.fotoRepo.create({
                visita,
                file_name: nuevoNombre,
                file_path,
                mime_type: file.mimetype,
            });
            return this.fotoRepo.save(foto);
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isInvitado, labIds } = this.auth;
            if (!isInvitado) {
                const foto = yield this.fotoRepo.findOne({ where: { id }, relations: { visita: true } });
                if (!foto)
                    throw new common_1.NotFoundException(`Foto ${id} no encontrada`);
                return foto;
            }
            const qb = this.fotoRepo.createQueryBuilder('f')
                .leftJoinAndSelect('f.visita', 'visita')
                .leftJoin('visita.parcela', 'parcela')
                .leftJoin('parcela.tratamiento', 'trat')
                .leftJoin('trat.productos', 'tp')
                .leftJoin('tp.producto', 'prod')
                .leftJoin('prod.laboratorio', 'lab')
                .where('f.id = :id', { id })
                .andWhere('lab.id IN (:...labIds)', { labIds })
                .distinct(true);
            const foto = yield qb.getOne();
            if (!foto)
                throw new common_1.NotFoundException(`Foto ${id} no encontrada`);
            return foto;
        });
    }
    remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.fotoRepo.delete({ id });
            if (!result.affected)
                throw new common_1.NotFoundException(`Foto ${id} no encontrada`);
            return { deleted: true };
        });
    }
    findByVisita(visitaId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const page = (_a = query === null || query === void 0 ? void 0 : query.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = query === null || query === void 0 ? void 0 : query.limit) !== null && _b !== void 0 ? _b : 10;
            const sort = (_c = query === null || query === void 0 ? void 0 : query.sort) !== null && _c !== void 0 ? _c : 'id';
            const order = ((_d = query === null || query === void 0 ? void 0 : query.order) !== null && _d !== void 0 ? _d : 'ASC');
            const { isInvitado, labIds } = this.auth;
            const qb = this.fotoRepo.createQueryBuilder('f')
                .leftJoinAndSelect('f.visita', 'visita')
                .leftJoin('visita.parcela', 'parcela')
                .leftJoin('parcela.tratamiento', 'trat')
                .leftJoin('trat.productos', 'tp')
                .leftJoin('tp.producto', 'prod')
                .leftJoin('prod.laboratorio', 'lab')
                .where('visita.id = :visitaId', { visitaId });
            if (isInvitado)
                qb.andWhere('lab.id IN (:...labIds)', { labIds }).distinct(true);
            const [data, total] = yield qb
                .orderBy(`f.${sort}`, order)
                .skip((page - 1) * limit)
                .take(limit)
                .getManyAndCount();
            return { data, meta: { total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) } };
        });
    }
};
exports.FotosService = FotosService;
exports.FotosService = FotosService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __param(1, (0, typeorm_1.InjectRepository)(foto_registro_entity_1.FotoRegistro)),
    __param(2, (0, typeorm_1.InjectRepository)(datos_campo_entity_1.DatosCampo)),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository])
], FotosService);
