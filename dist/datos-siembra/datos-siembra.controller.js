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
exports.DatosSiembraController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const datos_siembra_service_1 = require("./datos-siembra.service");
const create_datos_siembra_dto_1 = require("./dto/create-datos-siembra.dto");
const update_datos_siembra_dto_1 = require("./dto/update-datos-siembra.dto");
const datos_siembra_entity_1 = require("../entities/datos-siembra.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let DatosSiembraController = class DatosSiembraController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(parcelaId, ensayoId) {
        if (parcelaId) {
            return this.service.findByParcelaId(parseInt(parcelaId, 10));
        }
        if (ensayoId) {
            return this.service.findByEnsayoId(parseInt(ensayoId, 10));
        }
        return this.service.findAll();
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
exports.DatosSiembraController = DatosSiembraController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear registro de datos de siembra' }),
    (0, swagger_1.ApiOkResponse)({ type: datos_siembra_entity_1.DatosSiembra }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_datos_siembra_dto_1.CreateDatosSiembraDto]),
    __metadata("design:returntype", void 0)
], DatosSiembraController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar datos de siembra (opcionalmente filtrar por parcelaId o ensayoId)' }),
    (0, swagger_1.ApiQuery)({ name: 'parcelaId', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'ensayoId', type: Number, required: false }),
    (0, swagger_1.ApiOkResponse)({ type: datos_siembra_entity_1.DatosSiembra, isArray: true }),
    __param(0, (0, common_1.Query)('parcelaId')),
    __param(1, (0, common_1.Query)('ensayoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DatosSiembraController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener datos de siembra por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: datos_siembra_entity_1.DatosSiembra }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DatosSiembraController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar datos de siembra' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: datos_siembra_entity_1.DatosSiembra }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_datos_siembra_dto_1.UpdateDatosSiembraDto]),
    __metadata("design:returntype", void 0)
], DatosSiembraController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar datos de siembra' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DatosSiembraController.prototype, "remove", null);
exports.DatosSiembraController = DatosSiembraController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('datos-siembra'),
    (0, common_1.Controller)('datos-siembra'),
    __metadata("design:paramtypes", [datos_siembra_service_1.DatosSiembraService])
], DatosSiembraController);
