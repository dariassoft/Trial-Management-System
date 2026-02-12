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
exports.PermisosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permisos_service_1 = require("./permisos.service");
const create_permiso_dto_1 = require("./dto/create-permiso.dto");
const update_permiso_dto_1 = require("./dto/update-permiso.dto");
const permiso_entity_1 = require("../entities/permiso.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let PermisosController = class PermisosController {
    constructor(permisosService) {
        this.permisosService = permisosService;
    }
    create(createPermisoDto) {
        return this.permisosService.create(createPermisoDto);
    }
    findAll(query) {
        return this.permisosService.findAll(query);
    }
    findByRolId(rol_id) {
        return this.permisosService.findByRolId(rol_id);
    }
    findOne(id) {
        return this.permisosService.findOne(id);
    }
    update(id, updatePermisoDto) {
        return this.permisosService.update(id, updatePermisoDto);
    }
    remove(id) {
        return this.permisosService.remove(id);
    }
    asignarPermisosDefault(rol_id) {
        return this.permisosService.asignarPermisosDefault(rol_id);
    }
    initPermisos() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.permisosService.initAllPermisosDefault();
        });
    }
};
exports.PermisosController = PermisosController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un permiso' }),
    (0, swagger_1.ApiCreatedResponse)({ type: permiso_entity_1.Permiso, description: 'Permiso creado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permiso_dto_1.CreatePermisoDto]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar permisos (paginado y filtrado)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista paginada de permisos',
        schema: {
            example: {
                data: [],
                meta: { total: 0, page: 1, limit: 10, pageCount: 0 },
            },
        },
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    (0, swagger_1.ApiQuery)({ name: 'rol_id', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'recurso', required: false, type: String }),
    (0, swagger_1.ApiQuery)({
        name: 'accion',
        required: false,
        enum: permiso_entity_1.AccionPermiso,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('rol/:rol_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los permisos de un rol' }),
    (0, swagger_1.ApiParam)({ name: 'rol_id', type: Number }),
    __param(0, (0, common_1.Param)('rol_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "findByRolId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un permiso por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un permiso' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_permiso_dto_1.UpdatePermisoDto]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un permiso' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "remove", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)('rol/:rol_id/asignar-default'),
    (0, swagger_1.ApiOperation)({
        summary: 'Asignar permisos por defecto a un rol',
    }),
    (0, swagger_1.ApiParam)({ name: 'rol_id', type: Number }),
    __param(0, (0, common_1.Param)('rol_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PermisosController.prototype, "asignarPermisosDefault", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)('init'),
    (0, swagger_1.ApiOperation)({
        summary: 'Inicializar permisos por defecto para TODOS los roles',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Permisos inicializados',
        schema: {
            example: {
                message: 'Permisos inicializados exitosamente',
                totalPermisosCreados: 100,
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermisosController.prototype, "initPermisos", null);
exports.PermisosController = PermisosController = __decorate([
    (0, swagger_1.ApiTags)('permisos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('permisos'),
    __metadata("design:paramtypes", [permisos_service_1.PermisosService])
], PermisosController);
