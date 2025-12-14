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
exports.BloquesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bloques_service_1 = require("./bloques.service");
const create_bloque_dto_1 = require("./dto/create-bloque.dto");
const update_bloque_dto_1 = require("./dto/update-bloque.dto");
const bloque_entity_1 = require("../entities/bloque.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let BloquesController = class BloquesController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(ensayoId) {
        const ensayoIdNum = ensayoId ? parseInt(ensayoId, 10) : undefined;
        return this.service.findAll(ensayoIdNum);
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
exports.BloquesController = BloquesController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un bloque' }),
    (0, swagger_1.ApiCreatedResponse)({ type: bloque_entity_1.Bloque, description: 'Bloque creado' }),
    (0, swagger_1.ApiBody)({ type: create_bloque_dto_1.CreateBloqueDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bloque_dto_1.CreateBloqueDto]),
    __metadata("design:returntype", void 0)
], BloquesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar bloques' }),
    (0, swagger_1.ApiOkResponse)({ type: bloque_entity_1.Bloque, isArray: true }),
    __param(0, (0, common_1.Query)('ensayoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BloquesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener bloque por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: bloque_entity_1.Bloque }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BloquesController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar bloque' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: bloque_entity_1.Bloque }),
    (0, swagger_1.ApiBody)({ type: update_bloque_dto_1.UpdateBloqueDto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_bloque_dto_1.UpdateBloqueDto]),
    __metadata("design:returntype", void 0)
], BloquesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar bloque' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BloquesController.prototype, "remove", null);
exports.BloquesController = BloquesController = __decorate([
    (0, swagger_1.ApiTags)('bloques'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('bloques'),
    __metadata("design:paramtypes", [bloques_service_1.BloquesService])
], BloquesController);
