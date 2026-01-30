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
exports.FotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const fotos_service_1 = require("./fotos.service");
const foto_registro_entity_1 = require("../entities/foto-registro.entity");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
// Configuración de Multer para almacenamiento
const storage = (0, multer_1.diskStorage)({
    destination: (req, file, cb) => {
        const uploadPath = (0, path_1.join)(process.cwd(), 'uploads', 'media');
        if (!(0, fs_1.existsSync)(uploadPath)) {
            (0, fs_1.mkdirSync)(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = (0, path_1.extname)(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    // Aceptar imágenes y videos
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|mp4|webm|mov|avi)$/)) {
        cb(null, true);
    }
    else {
        cb(new common_1.BadRequestException('Tipo de archivo no soportado'), false);
    }
};
let FotosController = class FotosController {
    constructor(service) {
        this.service = service;
    }
    upload(file, parcelaId, momentoId, ensayoId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                throw new common_1.BadRequestException('No se recibió ningún archivo');
            }
            // Crear registro en la base de datos
            // Por ahora guardamos el archivo y retornamos info
            // TODO: Crear o buscar DatosCampo para asociar la foto
            const filePath = `/uploads/media/${file.filename}`;
            return {
                success: true,
                file: {
                    filename: file.filename,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    path: filePath,
                },
                meta: {
                    parcelaId: parcelaId ? parseInt(parcelaId, 10) : null,
                    momentoId: momentoId ? parseInt(momentoId, 10) : null,
                    ensayoId: ensayoId ? parseInt(ensayoId, 10) : null,
                    type: type || 'photo',
                },
            };
        });
    }
    findByVisita(visitaId, query) {
        return this.service.findByVisita(visitaId, query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.FotosController = FotosController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } })),
    (0, swagger_1.ApiOperation)({ summary: 'Subir foto o video' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary', description: 'Archivo de imagen o video' },
                parcelaId: { type: 'number', description: 'ID de la parcela' },
                momentoId: { type: 'number', description: 'ID del momento de evaluación' },
                ensayoId: { type: 'number', description: 'ID del ensayo' },
                type: { type: 'string', enum: ['photo', 'video'], description: 'Tipo de archivo' },
            },
            required: ['file'],
        },
    }),
    (0, swagger_1.ApiOkResponse)({ type: foto_registro_entity_1.FotoRegistro }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('parcelaId')),
    __param(2, (0, common_1.Body)('momentoId')),
    __param(3, (0, common_1.Body)('ensayoId')),
    __param(4, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FotosController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('por-visita/:visitaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar fotos por visita (paginado)' }),
    (0, swagger_1.ApiParam)({ name: 'visitaId', type: Number, description: 'ID de la visita (DatosCampo)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Lista paginada de fotos', schema: { example: { data: [{ id: 1, file_name: 'foto.jpg', file_path: '/uploads/visita_1/foto.jpg', mime_type: 'image/jpeg', fecha_subida: '2025-11-04T10:00:00.000Z', visita: { id: 1 } }], meta: { total: 1, page: 1, limit: 10, pageCount: 1 } } } }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    __param(0, (0, common_1.Param)('visitaId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PageQueryDto]),
    __metadata("design:returntype", void 0)
], FotosController.prototype, "findByVisita", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener foto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: foto_registro_entity_1.FotoRegistro }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FotosController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar foto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], FotosController.prototype, "remove", null);
exports.FotosController = FotosController = __decorate([
    (0, swagger_1.ApiTags)('fotos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('fotos'),
    __metadata("design:paramtypes", [fotos_service_1.FotosService])
], FotosController);
