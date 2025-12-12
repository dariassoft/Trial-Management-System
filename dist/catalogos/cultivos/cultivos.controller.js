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
exports.CultivosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cultivos_service_1 = require("./cultivos.service");
const create_cultivo_dto_1 = require("./dto/create-cultivo.dto");
const update_cultivo_dto_1 = require("./dto/update-cultivo.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const rol_entity_1 = require("../../entities/rol.entity");
let CultivosController = class CultivosController {
    constructor(cultivosService) {
        this.cultivosService = cultivosService;
    }
    create(createCultivoDto) {
        return this.cultivosService.create(createCultivoDto);
    }
    findAll() {
        return this.cultivosService.findAll();
    }
    findOne(id) {
        return this.cultivosService.findOne(id);
    }
    findVariedadesPorCultivo(id) {
        return this.cultivosService.findVariedadesPorCultivo(id);
    }
    update(id, updateCultivoDto) {
        return this.cultivosService.update(id, updateCultivoDto);
    }
    remove(id) {
        return this.cultivosService.remove(id);
    }
};
exports.CultivosController = CultivosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo cultivo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cultivo creado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden (Sin permisos)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cultivo_dto_1.CreateCultivoDto]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de todos los cultivos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un cultivo por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/variedades'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las variedades de un cultivo específico' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "findVariedadesPorCultivo", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un cultivo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cultivo_dto_1.UpdateCultivoDto]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un cultivo (y sus variedades)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CultivosController.prototype, "remove", null);
exports.CultivosController = CultivosController = __decorate([
    (0, swagger_1.ApiTags)('Catálogo - Cultivos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('catalogos/cultivos'),
    __metadata("design:paramtypes", [cultivos_service_1.CultivosService])
], CultivosController);
