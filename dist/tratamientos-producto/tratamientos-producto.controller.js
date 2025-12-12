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
exports.TratamientosProductoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tratamientos_producto_service_1 = require("./tratamientos-producto.service");
const create_tratamiento_producto_dto_1 = require("./dto/create-tratamiento-producto.dto");
const update_tratamiento_producto_dto_1 = require("./dto/update-tratamiento-producto.dto");
const tratamiento_producto_entity_1 = require("../entities/tratamiento-producto.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let TratamientosProductoController = class TratamientosProductoController {
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
exports.TratamientosProductoController = TratamientosProductoController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Asociar un producto a un tratamiento (con dosis y estadio)' }),
    (0, swagger_1.ApiCreatedResponse)({ type: tratamiento_producto_entity_1.TratamientoProducto, description: 'Asociación creada' }),
    (0, swagger_1.ApiBody)({
        type: create_tratamiento_producto_dto_1.CreateTratamientoProductoDto,
        examples: {
            default: {
                value: {
                    tratamientoId: 1,
                    productoId: 2,
                    dosis: '800',
                    unidadDosis: 'cc/ha',
                    estadio: 'V4',
                },
            },
            testigo: {
                value: {
                    tratamientoId: 1,
                    productoId: null,
                    dosis: null,
                    unidadDosis: null,
                    estadio: null,
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tratamiento_producto_dto_1.CreateTratamientoProductoDto]),
    __metadata("design:returntype", void 0)
], TratamientosProductoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar asociaciones Tratamiento-Producto' }),
    (0, swagger_1.ApiOkResponse)({ type: tratamiento_producto_entity_1.TratamientoProducto, isArray: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TratamientosProductoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener asociación por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: tratamiento_producto_entity_1.TratamientoProducto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TratamientosProductoController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar asociación Tratamiento-Producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: tratamiento_producto_entity_1.TratamientoProducto }),
    (0, swagger_1.ApiBody)({
        type: update_tratamiento_producto_dto_1.UpdateTratamientoProductoDto,
        examples: {
            default: {
                value: {
                    dosis: '500',
                    unidadDosis: 'gr/ha',
                    estadio: 'V3',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tratamiento_producto_dto_1.UpdateTratamientoProductoDto]),
    __metadata("design:returntype", void 0)
], TratamientosProductoController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar asociación' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TratamientosProductoController.prototype, "remove", null);
exports.TratamientosProductoController = TratamientosProductoController = __decorate([
    (0, swagger_1.ApiTags)('tratamientos-producto'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('tratamientos-producto'),
    __metadata("design:paramtypes", [tratamientos_producto_service_1.TratamientosProductoService])
], TratamientosProductoController);
