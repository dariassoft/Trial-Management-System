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
exports.AplicacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const aplicaciones_service_1 = require("./aplicaciones.service");
const create_aplicacion_dto_1 = require("./dto/create-aplicacion.dto");
const update_aplicacion_dto_1 = require("./dto/update-aplicacion.dto");
const aplicacion_entity_1 = require("../entities/aplicacion.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let AplicacionesController = class AplicacionesController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(ensayoId) {
        return this.service.findAll({ ensayoId: ensayoId ? parseInt(ensayoId, 10) : undefined });
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
exports.AplicacionesController = AplicacionesController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una aplicación' }),
    (0, swagger_1.ApiCreatedResponse)({ type: aplicacion_entity_1.Aplicacion, description: 'Aplicación creada' }),
    (0, swagger_1.ApiBody)({
        type: create_aplicacion_dto_1.CreateAplicacionDto,
        examples: {
            default: {
                value: {
                    ensayoId: 1,
                    nombreAplicacion: 'Primera aplicación',
                    fechaHora: '2025-03-18T10:30:00.000Z',
                    estadioCultivo: 'V6',
                    tempC: 25.5,
                    humedadPct: 60.0,
                    vientoKmh: 12.3,
                    equipoInfo: 'Pulverizadora Jacto',
                    picoInfo: 'XR11002',
                    presionBar: 2.5,
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_aplicacion_dto_1.CreateAplicacionDto]),
    __metadata("design:returntype", void 0)
], AplicacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar aplicaciones' }),
    (0, swagger_1.ApiQuery)({ name: 'ensayoId', required: false, type: Number, description: 'Filtrar por ensayo' }),
    (0, swagger_1.ApiOkResponse)({ type: aplicacion_entity_1.Aplicacion, isArray: true }),
    __param(0, (0, common_1.Query)('ensayoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AplicacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener aplicación por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: aplicacion_entity_1.Aplicacion }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AplicacionesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar aplicación' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: aplicacion_entity_1.Aplicacion }),
    (0, swagger_1.ApiBody)({
        type: update_aplicacion_dto_1.UpdateAplicacionDto,
        examples: {
            default: {
                value: {
                    estadioCultivo: 'V8',
                    tempC: 22.1,
                    presionBar: 2.8,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_aplicacion_dto_1.UpdateAplicacionDto]),
    __metadata("design:returntype", void 0)
], AplicacionesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar aplicación' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AplicacionesController.prototype, "remove", null);
exports.AplicacionesController = AplicacionesController = __decorate([
    (0, swagger_1.ApiTags)('aplicaciones'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('aplicaciones'),
    __metadata("design:paramtypes", [aplicaciones_service_1.AplicacionesService])
], AplicacionesController);
