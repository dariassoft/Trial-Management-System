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
exports.MomentosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const momentos_service_1 = require("./momentos.service");
const create_momento_dto_1 = require("./dto/create-momento.dto");
const update_momento_dto_1 = require("./dto/update-momento.dto");
const momento_evaluacion_entity_1 = require("../entities/momento-evaluacion.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let MomentosController = class MomentosController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(aplicacionId) {
        return this.service.findAll({ aplicacionId: aplicacionId ? parseInt(aplicacionId, 10) : undefined });
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    getProgreso(id) {
        return this.service.getProgreso(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.MomentosController = MomentosController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un momento de evaluación' }),
    (0, swagger_1.ApiCreatedResponse)({ type: momento_evaluacion_entity_1.MomentoEvaluacion, description: 'Momento creado' }),
    (0, swagger_1.ApiBody)({
        type: create_momento_dto_1.CreateMomentoDto,
        examples: {
            default: {
                value: {
                    aplicacionId: 1,
                    nombreMomento: '7DDA',
                    diasDespuesAplicacion: 7,
                    fechaEvaluacion: '2025-04-01',
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_momento_dto_1.CreateMomentoDto]),
    __metadata("design:returntype", void 0)
], MomentosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar momentos de evaluación' }),
    (0, swagger_1.ApiQuery)({ name: 'aplicacionId', required: false, type: Number, description: 'Filtrar por aplicación' }),
    (0, swagger_1.ApiOkResponse)({ type: momento_evaluacion_entity_1.MomentoEvaluacion, isArray: true }),
    __param(0, (0, common_1.Query)('aplicacionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MomentosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener momento de evaluación por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: momento_evaluacion_entity_1.MomentoEvaluacion }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MomentosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/progreso'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener progreso de un momento (parcelas medidas vs pendientes)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: {
                momentoId: 1,
                nombreMomento: '7 DDA',
                diasDespuesAplicacion: 7,
                fechaEvaluacion: '2025-04-01',
                totalParcelas: 48,
                parcelasMedidas: 24,
                parcelasPendientes: 24,
                porcentaje: 50,
                estado: 'en_progreso',
                idsParcelasMedidas: [1, 2, 3]
            }
        }
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MomentosController.prototype, "getProgreso", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar momento de evaluación' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: momento_evaluacion_entity_1.MomentoEvaluacion }),
    (0, swagger_1.ApiBody)({
        type: update_momento_dto_1.UpdateMomentoDto,
        examples: {
            default: {
                value: {
                    nombreMomento: '14DDA',
                    diasDespuesAplicacion: 14,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_momento_dto_1.UpdateMomentoDto]),
    __metadata("design:returntype", void 0)
], MomentosController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar momento de evaluación' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MomentosController.prototype, "remove", null);
exports.MomentosController = MomentosController = __decorate([
    (0, swagger_1.ApiTags)('momentos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('momentos'),
    __metadata("design:paramtypes", [momentos_service_1.MomentosService])
], MomentosController);
