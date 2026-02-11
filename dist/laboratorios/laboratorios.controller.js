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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LaboratoriosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const laboratorios_service_1 = require("./laboratorios.service");
const create_laboratorio_dto_1 = require("./dto/create-laboratorio.dto");
const update_laboratorio_dto_1 = require("./dto/update-laboratorio.dto");
const laboratorio_entity_1 = require("../entities/laboratorio.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let LaboratoriosController = class LaboratoriosController {
    constructor(service) {
        this.service = service;
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
};
exports.LaboratoriosController = LaboratoriosController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un laboratorio' }),
    (0, swagger_1.ApiCreatedResponse)({
        type: laboratorio_entity_1.Laboratorio,
        description: 'Laboratorio creado',
        schema: { example: {
                id: 1,
                nombre: 'ACME Agro Labs',
                descripcion: 'Laboratorio de análisis de suelos',
                direccion: 'Calle Principal 123',
                telefono: '3875789133',
                email: 'lab@acme.com',
                contacto: 'Ing. Juan Pérez',
                esta_activo: true,
                createdAt: '2026-02-11T10:00:00Z',
                updatedAt: '2026-02-11T10:00:00Z'
            } }
    }),
    (0, swagger_1.ApiBody)({
        type: create_laboratorio_dto_1.CreateLaboratorioDto,
        examples: {
            default: {
                summary: 'Laboratorio completo',
                value: {
                    nombre: 'ACME Agro Labs',
                    descripcion: 'Laboratorio de análisis de suelos',
                    direccion: 'Calle Principal 123, Ciudad',
                    telefono: '3875789133',
                    email: 'lab@acme.com',
                    contacto: 'Ing. Juan Pérez',
                    esta_activo: true,
                },
            },
            minimal: {
                summary: 'Solo nombre requerido',
                value: {
                    nombre: 'Mi Laboratorio',
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_laboratorio_dto_1.CreateLaboratorioDto]),
    __metadata("design:returntype", void 0)
], LaboratoriosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar laboratorios (paginado y filtrado)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista paginada de laboratorios',
        schema: {
            example: {
                data: [
                    { id: 1, nombre: 'ACME Labs', descripcion: 'Lab principal', esta_activo: true }
                ],
                meta: { total: 1, page: 1, limit: 10, pageCount: 1 }
            }
        }
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Registros por página (default: 10)' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String, description: 'Campo para ordenar (default: id)' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Dirección de orden (default: ASC)' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, type: String, description: 'Búsqueda por nombre, descripción, email o contacto' }),
    (0, swagger_1.ApiQuery)({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por estado activo' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LaboratoriosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener laboratorio por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({
        type: laboratorio_entity_1.Laboratorio,
        schema: { example: {
                id: 1,
                nombre: 'ACME Labs',
                descripcion: 'Lab principal',
                direccion: 'Calle Principal 123',
                telefono: '3875789133',
                email: 'lab@acme.com',
                contacto: 'Ing. Juan Pérez',
                esta_activo: true,
                usuariosAsignados: []
            } }
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LaboratoriosController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar laboratorio' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: laboratorio_entity_1.Laboratorio, description: 'Laboratorio actualizado' }),
    (0, swagger_1.ApiBody)({
        type: update_laboratorio_dto_1.UpdateLaboratorioDto,
        examples: {
            default: {
                summary: 'Actualización completa',
                value: {
                    nombre: 'ACME Labs Actualizado',
                    descripcion: 'Descripción actualizada',
                    telefono: '3875000000',
                    email: 'newemail@acme.com',
                    esta_activo: true,
                },
            },
            partial: {
                summary: 'Actualización parcial',
                value: {
                    esta_activo: false,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_laboratorio_dto_1.UpdateLaboratorioDto]),
    __metadata("design:returntype", void 0)
], LaboratoriosController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar laboratorio' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Laboratorio eliminado',
        schema: { example: { deleted: true } }
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LaboratoriosController.prototype, "remove", null);
exports.LaboratoriosController = LaboratoriosController = __decorate([
    (0, swagger_1.ApiTags)('laboratorios'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('laboratorios'),
    __metadata("design:paramtypes", [laboratorios_service_1.LaboratoriosService])
], LaboratoriosController);
