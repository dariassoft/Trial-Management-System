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
exports.CultivoVariedadesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cultivo_variedades_service_1 = require("./cultivo-variedades.service");
const create_cultivo_variedad_dto_1 = require("./dto/create-cultivo-variedad.dto");
const update_cultivo_variedad_dto_1 = require("./dto/update-cultivo-variedad.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const rol_entity_1 = require("../../entities/rol.entity");
let CultivoVariedadesController = class CultivoVariedadesController {
    constructor(cultivoVariedadesService) {
        this.cultivoVariedadesService = cultivoVariedadesService;
    }
    create(createCultivoVariedadDto) {
        return this.cultivoVariedadesService.create(createCultivoVariedadDto);
    }
    findAll() {
        return this.cultivoVariedadesService.findAll();
    }
    findOne(id) {
        return this.cultivoVariedadesService.findOne(id);
    }
    update(id, updateCultivoVariedadDto) {
        return this.cultivoVariedadesService.update(id, updateCultivoVariedadDto);
    }
    remove(id) {
        return this.cultivoVariedadesService.remove(id);
    }
};
exports.CultivoVariedadesController = CultivoVariedadesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva variedad (asignada a un cultivo)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Variedad creada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cultivo padre no encontrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cultivo_variedad_dto_1.CreateCultivoVariedadDto]),
    __metadata("design:returntype", void 0)
], CultivoVariedadesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de todas las variedades' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CultivoVariedadesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una variedad por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CultivoVariedadesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una variedad' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cultivo_variedad_dto_1.UpdateCultivoVariedadDto]),
    __metadata("design:returntype", void 0)
], CultivoVariedadesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una variedad' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CultivoVariedadesController.prototype, "remove", null);
exports.CultivoVariedadesController = CultivoVariedadesController = __decorate([
    (0, swagger_1.ApiTags)('Catálogo - Variedades de Cultivo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('catalogos/cultivo-variedades'),
    __metadata("design:paramtypes", [cultivo_variedades_service_1.CultivoVariedadesService])
], CultivoVariedadesController);
