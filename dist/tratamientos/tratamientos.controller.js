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
exports.TratamientosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tratamientos_service_1 = require("./tratamientos.service");
const create_tratamiento_dto_1 = require("./dto/create-tratamiento.dto");
const update_tratamiento_dto_1 = require("./dto/update-tratamiento.dto");
const tratamiento_entity_1 = require("../entities/tratamiento.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let TratamientosController = class TratamientosController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, sort = 'numeroTrat', order = 'ASC', q, protocoloId, esTestigo) {
            return this.service.findAll({
                page,
                limit,
                sort,
                order,
                q,
                protocoloId,
                esTestigo,
            });
        });
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
exports.TratamientosController = TratamientosController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo tratamiento' }),
    (0, swagger_1.ApiCreatedResponse)({ type: tratamiento_entity_1.Tratamiento, description: 'Tratamiento creado exitosamente' }),
    (0, swagger_1.ApiBody)({
        type: create_tratamiento_dto_1.CreateTratamientoDto,
        examples: {
            testigo: {
                summary: 'Tratamiento Testigo (control)',
                value: {
                    protocoloId: 1,
                    numeroTrat: 1,
                    descripcion: 'Testigo (Sin aplicación)',
                    esTestigo: true,
                },
            },
            conProducto: {
                summary: 'Tratamiento con producto',
                value: {
                    protocoloId: 1,
                    numeroTrat: 2,
                    descripcion: 'Fomesafen 25% - 800 cc/ha - V4',
                    esTestigo: false,
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tratamiento_dto_1.CreateTratamientoDto]),
    __metadata("design:returntype", void 0)
], TratamientosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tratamientos con búsqueda y filtros' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista de tratamientos',
        schema: {
            example: {
                data: [],
                meta: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    pageCount: 0,
                },
            },
        },
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', type: Number, required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', type: Number, required: false, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'sort', type: String, required: false, example: 'numeroTrat' }),
    (0, swagger_1.ApiQuery)({ name: 'order', enum: ['ASC', 'DESC'], required: false, example: 'ASC' }),
    (0, swagger_1.ApiQuery)({ name: 'q', type: String, required: false, description: 'Búsqueda por descripción' }),
    (0, swagger_1.ApiQuery)({ name: 'protocoloId', type: Number, required: false, description: 'Filtro por protocolo' }),
    (0, swagger_1.ApiQuery)({ name: 'esTestigo', type: Boolean, required: false, description: 'Filtro por si es testigo' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sort')),
    __param(3, (0, common_1.Query)('order')),
    __param(4, (0, common_1.Query)('q')),
    __param(5, (0, common_1.Query)('protocoloId')),
    __param(6, (0, common_1.Query)('esTestigo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, Number, Boolean]),
    __metadata("design:returntype", Promise)
], TratamientosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un tratamiento por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID del tratamiento' }),
    (0, swagger_1.ApiOkResponse)({ type: tratamiento_entity_1.Tratamiento, description: 'Tratamiento encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TratamientosController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un tratamiento' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ type: tratamiento_entity_1.Tratamiento, description: 'Tratamiento actualizado' }),
    (0, swagger_1.ApiBody)({
        type: update_tratamiento_dto_1.UpdateTratamientoDto,
        examples: {
            default: {
                value: {
                    descripcion: 'Fomesafen 25% + GZ - 800+500 cc/ha - V4 (Actualizado)',
                    numeroTrat: 3,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tratamiento_dto_1.UpdateTratamientoDto]),
    __metadata("design:returntype", void 0)
], TratamientosController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.MANAGER, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un tratamiento' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiOkResponse)({ schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TratamientosController.prototype, "remove", null);
exports.TratamientosController = TratamientosController = __decorate([
    (0, swagger_1.ApiTags)('tratamientos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('tratamientos'),
    __metadata("design:paramtypes", [tratamientos_service_1.TratamientosService])
], TratamientosController);
