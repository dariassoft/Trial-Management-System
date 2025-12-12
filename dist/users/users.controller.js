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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const assign_labs_dto_1 = require("./dto/assign-labs.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let UsersController = class UsersController {
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
    addLabs(id, body) {
        return this.service.addLaboratorios(id, body.laboratorioIds);
    }
    removeLab(id, labId) {
        return this.service.removeLaboratorio(id, labId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear usuario' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Usuario creado (sin password en la respuesta)', schema: { example: {
                id: 10,
                username: 'user@example.com',
                nombre: 'María',
                apellido: 'Pérez',
                telefono: '3875789133',
                fecha_nacimiento: '1990-05-21',
                esta_activo: true,
                rol: { id: 2, nombre: 'Administrador' },
                laboratoriosAsignados: [{ id: 1, laboratorio: { id: 1, nombre: 'ACME Agro Labs' } }]
            } } }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto, examples: { default: { value: {
                    username: 'user@example.com', password: 'S3gura123', rolId: 2,
                    nombre: 'María', apellido: 'Pérez', telefono: '3875789133', fecha_nacimiento: '1990-05-21',
                    esta_activo: true, laboratorioIds: [1, 2]
                } } } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar usuarios (paginado y filtrado)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Lista paginada de usuarios', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String, description: 'Campos permitidos: id, username, esta_activo' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiQuery)({ name: 'rolId', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'activo', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, type: String, description: 'Buscar por username/nombre/apellido/teléfono' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener usuario por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ description: 'Usuario', schema: { example: {
                id: 10, username: 'user@example.com', nombre: 'María', apellido: 'Pérez', telefono: '3875789133', esta_activo: true,
                rol: { id: 2, nombre: 'Administrador' }, laboratoriosAsignados: [{ id: 1, laboratorio: { id: 1, nombre: 'ACME Agro Labs' } }]
            } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ description: 'Usuario actualizado (sin password en la respuesta)' }),
    (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto, examples: { default: { value: {
                    password: 'NuevaP4ss', rolId: 3, nombre: 'Maria', telefono: '3875000000', esta_activo: true
                } } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar usuario' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(':id/laboratorios'),
    (0, swagger_1.ApiOperation)({ summary: 'Asignar laboratorios a un usuario' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ description: 'Usuario con laboratorios actualizados' }),
    (0, swagger_1.ApiBody)({ type: assign_labs_dto_1.AssignLabsDto, examples: { default: { value: { laboratorioIds: [1, 2, 3] } } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, assign_labs_dto_1.AssignLabsDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "addLabs", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id/laboratorios/:labId'),
    (0, swagger_1.ApiOperation)({ summary: 'Quitar un laboratorio del usuario' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'labId', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('labId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "removeLab", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('usuarios'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
