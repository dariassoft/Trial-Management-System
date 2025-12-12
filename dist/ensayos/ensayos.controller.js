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
exports.EnsayosController = void 0;
const common_1 = require("@nestjs/common");
const ensayos_service_1 = require("./ensayos.service");
const create_ensayo_dto_1 = require("./dto/create-ensayo.dto");
const update_ensayo_dto_1 = require("./dto/update-ensayo.dto");
const swagger_1 = require("@nestjs/swagger");
const ensayo_entity_1 = require("../entities/ensayo.entity");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let EnsayosController = class EnsayosController {
    constructor(ensayosService) {
        this.ensayosService = ensayosService;
    }
    create(dto) {
        return this.ensayosService.create(dto);
    }
    findAll(query) {
        return this.ensayosService.findAll(query);
    }
    findOne(id) {
        return this.ensayosService.findOne(id);
    }
    update(id, dto) {
        return this.ensayosService.update(id, dto);
    }
    remove(id) {
        return this.ensayosService.remove(id);
    }
};
exports.EnsayosController = EnsayosController;
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo ensayo' }),
    (0, swagger_1.ApiCreatedResponse)({ type: ensayo_entity_1.Ensayo, description: 'El ensayo ha sido creado exitosamente.' }),
    (0, swagger_1.ApiBody)({
        type: create_ensayo_dto_1.CreateEnsayoDto,
        examples: {
            'Payload Completo': {
                summary: 'Ejemplo con todos los campos posibles',
                value: {
                    nombreEnsayo: 'Ensayo de Maíz Tardío 2025',
                    protocoloId: 2,
                    codigoLabor: 'LAB-2025-003',
                    laboratorioId: 1,
                    tipoEnsayoId: 4,
                    responsableId: 5,
                    provincia: 'Córdoba',
                    departamento: 'Río Cuarto',
                    establecimiento: 'El Progreso',
                    lote: 'Lote 7A',
                    latitud: -33.1306,
                    longitud: -64.349,
                    cultivoId: 1,
                    variedadId: 1,
                    tipoSiembraId: 1,
                    distSurcosCm: 52.5,
                    fechaInicio: '2025-12-10',
                    fechaSiembra: '2025-12-15',
                    fechaCosecha: '2026-05-20',
                    status: 'Por Iniciar',
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ensayo_dto_1.CreateEnsayoDto]),
    __metadata("design:returntype", void 0)
], EnsayosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos los ensayos (paginado y filtrado)' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Lista paginada de ensayos.', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Número de página a obtener.' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Número de resultados por página.' }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, type: String, description: 'Campo para ordenar (ej: id, nombreEnsayo, responsable.nombre)' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: false, enum: ['ASC', 'DESC'], description: 'Orden de clasificación (Ascendente o Descendente).' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, type: String, description: 'Búsqueda por nombre de ensayo, nombre de responsable o especie de cultivo.' }),
    (0, swagger_1.ApiQuery)({ name: 'laboratorio', required: false, type: String, description: 'Filtrar por nombre de laboratorio.' }),
    (0, swagger_1.ApiQuery)({ name: 'variedad', required: false, type: String, description: 'Filtrar por nombre de variedad.' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaSiembraStart', required: false, type: String, description: 'Fecha de siembra inicio (YYYY-MM-DD).' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaSiembraEnd', required: false, type: String, description: 'Fecha de siembra fin (YYYY-MM-DD).' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EnsayosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un ensayo por su ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID único del ensayo.' }),
    (0, swagger_1.ApiOkResponse)({ type: ensayo_entity_1.Ensayo, description: 'Detalles del ensayo solicitado.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnsayosController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un ensayo existente por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID único del ensayo a actualizar.' }),
    (0, swagger_1.ApiOkResponse)({ type: ensayo_entity_1.Ensayo, description: 'El ensayo ha sido actualizado exitosamente.' }),
    (0, swagger_1.ApiBody)({
        type: update_ensayo_dto_1.UpdateEnsayoDto,
        examples: {
            'Actualización Completa': {
                summary: 'Ejemplo actualizando todos los campos posibles',
                value: {
                    nombreEnsayo: 'Ensayo de Girasol 2025 (Corregido)',
                    protocoloId: 3,
                    codigoLabor: 'LAB-2025-004-MOD',
                    laboratorioId: 2,
                    tipoEnsayoId: 5,
                    responsableId: 6,
                    provincia: 'Santa Fe',
                    departamento: 'General López',
                    establecimiento: 'La Perseverancia',
                    lote: 'Lote 12B',
                    latitud: -33.754,
                    longitud: -61.96,
                    cultivoId: 2,
                    variedadId: 2,
                    tipoSiembraId: 2,
                    distSurcosCm: 70,
                    fechaInicio: '2025-10-15',
                    fechaSiembra: '2025-10-20',
                    fechaCosecha: '2026-04-25',
                    status: 'Activo',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_ensayo_dto_1.UpdateEnsayoDto]),
    __metadata("design:returntype", void 0)
], EnsayosController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.TECNICO, rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un ensayo por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'ID único del ensayo a eliminar.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'El ensayo ha sido eliminado exitosamente.', schema: { example: { deleted: true } } }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EnsayosController.prototype, "remove", null);
exports.EnsayosController = EnsayosController = __decorate([
    (0, swagger_1.ApiTags)('ensayos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('ensayos'),
    __metadata("design:paramtypes", [ensayos_service_1.EnsayosService])
], EnsayosController);
