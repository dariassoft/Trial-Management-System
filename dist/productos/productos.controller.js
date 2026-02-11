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
exports.ProductosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const productos_service_1 = require("./productos.service");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const update_producto_dto_1 = require("./dto/update-producto.dto");
const producto_entity_1 = require("../entities/producto.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let ProductosController = class ProductosController {
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
};
exports.ProductosController = ProductosController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un producto' }),
    (0, swagger_1.ApiCreatedResponse)({
        type: producto_entity_1.Producto,
        description: 'Producto creado',
        schema: { example: {
                id: 1,
                nombre_comercial: 'Herbicida X',
                descripcion: 'Herbicida selectivo para maíz',
                principio_activo: 'Glifosato 48%',
                formulacion: 'SL',
                tipo: 'Herbicida',
                unidad: 'L/ha',
                precio: 150.50,
                laboratorio: { id: 1, nombre: 'Lab Principal' }
            } }
    }),
    (0, swagger_1.ApiBody)({
        type: create_producto_dto_1.CreateProductoDto,
        examples: {
            default: {
                summary: 'Producto completo',
                value: {
                    nombre_comercial: 'Herbicida X',
                    descripcion: 'Herbicida selectivo para maíz post-emergencia',
                    principio_activo: 'Glifosato 48%',
                    formulacion: 'SL',
                    tipo: 'Herbicida',
                    unidad: 'L/ha',
                    precio: 150.50,
                    laboratorioId: 1,
                },
            },
            minimal: {
                summary: 'Solo nombre requerido',
                value: {
                    nombre_comercial: 'Mi Producto',
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar productos (paginado y filtrado)' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista paginada de productos',
        schema: {
            example: {
                data: [
                    { id: 1, nombre_comercial: 'Herbicida X', tipo: 'Herbicida', precio: 150.50 }
                ],
                meta: { total: 1, page: 1, limit: 10, pageCount: 1 }
            }
        }
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Número de página' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Registros por página' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String, description: 'Campo para ordenar' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Dirección de orden' }),
    (0, swagger_1.ApiQuery)({ name: 'laboratorioId', required: false, type: Number, description: 'Filtrar por laboratorio' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, type: String, description: 'Buscar por nombre/tipo/principio activo' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener producto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: producto_entity_1.Producto }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: producto_entity_1.Producto }),
    (0, swagger_1.ApiBody)({
        type: update_producto_dto_1.UpdateProductoDto,
        examples: {
            cambioNombre: {
                summary: 'Cambiar nombre y laboratorio',
                value: {
                    nombre_comercial: 'Herbicida X Plus',
                    laboratorioId: 2,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_producto_dto_1.UpdateProductoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "remove", null);
exports.ProductosController = ProductosController = __decorate([
    (0, swagger_1.ApiTags)('productos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('productos'),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ProductosController);
