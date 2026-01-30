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
exports.DatosCampoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const datos_campo_service_1 = require("./datos-campo.service");
const create_datos_campo_dto_1 = require("./dto/create-datos-campo.dto");
const update_datos_campo_dto_1 = require("./dto/update-datos-campo.dto");
const datos_campo_entity_1 = require("../entities/datos-campo.entity");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const platform_express_1 = require("@nestjs/platform-express");
const fotos_service_1 = require("../fotos/fotos.service");
const foto_registro_entity_1 = require("../entities/foto-registro.entity");
const Multer = __importStar(require("multer"));
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let DatosCampoController = class DatosCampoController {
    constructor(service, fotosService) {
        this.service = service;
        this.fotosService = fotosService;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
    uploadFoto(idVisita, file) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fotosService.create(idVisita, file);
        });
    }
    findMedicionesByVariable(variableId, query) {
        return this.service.findMedicionesByVariable(variableId, query);
    }
    findMedicionesByVisita(visitaId, query) {
        return this.service.findMedicionesByVisita(visitaId, query);
    }
};
exports.DatosCampoController = DatosCampoController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro de datos de campo' }),
    (0, swagger_1.ApiCreatedResponse)({ type: datos_campo_entity_1.DatosCampo, description: 'Datos de campo creados' }),
    (0, swagger_1.ApiBody)({
        type: create_datos_campo_dto_1.CreateDatosCampoDto,
        examples: {
            default: {
                summary: 'Visita con mediciones dinámicas',
                value: {
                    parcela_id_fk: 1,
                    momento_id_fk: 1,
                    observaciones: 'Sin observaciones',
                    mediciones: [
                        { variable_id: 1, valor: '10.5' },
                        { variable_id: 2, valor: 'Alto' },
                    ],
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_datos_campo_dto_1.CreateDatosCampoDto]),
    __metadata("design:returntype", void 0)
], DatosCampoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar datos de campo (paginado y filtrado)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Lista paginada', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiQuery)({ name: 'parcelaId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'momentoId', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DatosCampoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener datos de campo por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: datos_campo_entity_1.DatosCampo }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DatosCampoController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar datos de campo' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: datos_campo_entity_1.DatosCampo }),
    (0, swagger_1.ApiBody)({
        type: update_datos_campo_dto_1.UpdateDatosCampoDto,
        examples: {
            reemplazoMediciones: {
                summary: 'Actualizar observaciones y reemplazar mediciones',
                value: {
                    observaciones: 'Lluvia previa a la medición',
                    mediciones: [
                        { variable_id: 1, valor: '9.8' },
                        { variable_id: 3, valor: 'Bajo' }
                    ]
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_datos_campo_dto_1.UpdateDatosCampoDto]),
    __metadata("design:returntype", void 0)
], DatosCampoController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar datos de campo' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DatosCampoController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(':idVisita/upload-foto'),
    (0, swagger_1.ApiOperation)({ summary: 'Sube una foto o video para una visita (DatosCampo)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'Imagen o video (jpg, jpeg, png, webp, mp4, webm, mov); máx. 100MB' },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({ type: foto_registro_entity_1.FotoRegistro, description: 'Foto/video registrado' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Ejemplo de respuesta', schema: { example: { id: 1, file_name: 'foto.jpg', file_path: '/uploads/visita_1/foto.jpg', mime_type: 'image/jpeg', fecha_subida: '2025-11-04T10:00:00.000Z' } } }),
    (0, swagger_1.ApiParam)({ name: 'idVisita', required: true, description: 'ID de la visita (DatosCampo)', type: Number }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: Multer.diskStorage({
            destination: (req, file, cb) => {
                const fs = require('fs');
                const path = require('path');
                const visitaId = req.params.idVisita;
                const baseDir = path.join(process.cwd(), 'uploads');
                const visitaDir = path.join(baseDir, `visita_${visitaId}`);
                if (!fs.existsSync(baseDir))
                    fs.mkdirSync(baseDir, { recursive: true });
                if (!fs.existsSync(visitaDir))
                    fs.mkdirSync(visitaDir, { recursive: true });
                cb(null, visitaDir);
            },
            filename: (req, file, cb) => {
                const ext = (file.mimetype && file.mimetype.split('/')[1]) || 'bin';
                const rand = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
                cb(null, `visita_${req.params.idVisita}_${Date.now()}_${rand}.${ext}`);
            },
        }),
        limits: { fileSize: 100 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            // Aceptar imágenes y videos
            if (file.mimetype.match(/^(image|video)\//)) {
                cb(null, true);
            }
            else {
                cb(new Error('Tipo de archivo no soportado. Solo imágenes y videos.'), false);
            }
        },
    })),
    __param(0, (0, common_1.Param)('idVisita', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DatosCampoController.prototype, "uploadFoto", null);
__decorate([
    (0, common_1.Get)('mediciones/por-variable/:variableId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mediciones por variable (paginado)' }),
    (0, swagger_1.ApiParam)({ name: 'variableId', type: Number }),
    (0, swagger_1.ApiOkResponse)({ description: 'Lista paginada de mediciones', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    __param(0, (0, common_1.Param)('variableId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PageQueryDto]),
    __metadata("design:returntype", void 0)
], DatosCampoController.prototype, "findMedicionesByVariable", null);
__decorate([
    (0, common_1.Get)('mediciones/por-visita/:visitaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar mediciones por visita (paginado)' }),
    (0, swagger_1.ApiParam)({ name: 'visitaId', type: Number }),
    (0, swagger_1.ApiOkResponse)({ description: 'Lista paginada de mediciones', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    __param(0, (0, common_1.Param)('visitaId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PageQueryDto]),
    __metadata("design:returntype", void 0)
], DatosCampoController.prototype, "findMedicionesByVisita", null);
exports.DatosCampoController = DatosCampoController = __decorate([
    (0, swagger_1.ApiTags)('datos-campo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('datos-campo'),
    __metadata("design:paramtypes", [datos_campo_service_1.DatosCampoService,
        fotos_service_1.FotosService])
], DatosCampoController);
