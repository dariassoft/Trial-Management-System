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
exports.ProtocolosController = void 0;
// typescript
// Archivo: `src/protocolos/protocolos.controller.ts`
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const protocolos_service_1 = require("./protocolos.service");
const create_protocolo_dto_1 = require("./dto/create-protocolo.dto");
const update_protocolo_dto_1 = require("./dto/update-protocolo.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
const protocolo_entity_1 = require("../entities/protocolo.entity");
let ProtocolosController = class ProtocolosController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
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
exports.ProtocolosController = ProtocolosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo protocolo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Protocolo creado', type: protocolo_entity_1.Protocolo }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_protocolo_dto_1.CreateProtocoloDto]),
    __metadata("design:returntype", void 0)
], ProtocolosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de todos los protocolos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de protocolos', type: [protocolo_entity_1.Protocolo] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProtocolosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un protocolo por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Protocolo encontrado', type: protocolo_entity_1.Protocolo }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProtocolosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un protocolo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Protocolo actualizado', type: protocolo_entity_1.Protocolo }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_protocolo_dto_1.UpdateProtocoloDto]),
    __metadata("design:returntype", void 0)
], ProtocolosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un protocolo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Protocolo eliminado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProtocolosController.prototype, "remove", null);
exports.ProtocolosController = ProtocolosController = __decorate([
    (0, swagger_1.ApiTags)('Protocolos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('protocolos'),
    __metadata("design:paramtypes", [protocolos_service_1.ProtocolosService])
], ProtocolosController);
