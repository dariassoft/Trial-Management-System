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
exports.TiposEnsayoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tipos_ensayo_service_1 = require("./tipos-ensayo.service");
const create_tipo_ensayo_dto_1 = require("./dto/create-tipo-ensayo.dto");
const update_tipo_ensayo_dto_1 = require("./dto/update-tipo-ensayo.dto");
const add_variable_dto_1 = require("./dto/add-variable.dto");
const set_evaluacion_dto_1 = require("./dto/set-evaluacion.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const rol_entity_1 = require("../../entities/rol.entity");
let TiposEnsayoController = class TiposEnsayoController {
    constructor(service) {
        this.service = service;
    }
    // CRUD Tipos de Ensayo
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
    // Variables vinculadas al tipo
    listVars(id) {
        return this.service.listVariables(id);
    }
    addVar(id, dto) {
        return this.service.addVariable(id, dto);
    }
    removeVar(tevId) {
        return this.service.removeVariable(tevId);
    }
    // Días de evaluación
    getDias(id) {
        return this.service.getDias(id);
    }
    setEvaluacion(id, dto) {
        return this.service.setEvaluacion(id, dto);
    }
};
exports.TiposEnsayoController = TiposEnsayoController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un tipo de ensayo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tipo de ensayo creado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tipo_ensayo_dto_1.CreateTipoEnsayoDto]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tipos de ensayo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un tipo de ensayo por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un tipo de ensayo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_tipo_ensayo_dto_1.UpdateTipoEnsayoDto]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un tipo de ensayo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/variables'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar variables asociadas a un tipo de ensayo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "listVars", null);
__decorate([
    (0, common_1.Post)(':id/variables'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar una variable al tipo de ensayo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, add_variable_dto_1.AddVariableDto]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "addVar", null);
__decorate([
    (0, common_1.Delete)('variables/:tevId'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Quitar una variable del tipo de ensayo' }),
    __param(0, (0, common_1.Param)('tevId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "removeVar", null);
__decorate([
    (0, common_1.Get)(':id/dias'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar días de evaluación normalizados (DDA)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "getDias", null);
__decorate([
    (0, common_1.Put)(':id/evaluacion'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Establecer días de evaluación (acepta CSV o arreglo de enteros). Sincroniza evaluacion_csv y tabla normalizada.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, set_evaluacion_dto_1.SetEvaluacionDto]),
    __metadata("design:returntype", void 0)
], TiposEnsayoController.prototype, "setEvaluacion", null);
exports.TiposEnsayoController = TiposEnsayoController = __decorate([
    (0, swagger_1.ApiTags)('Catálogo - Tipos de Ensayo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('catalogos/tipos-ensayo'),
    __metadata("design:paramtypes", [tipos_ensayo_service_1.TiposEnsayoService])
], TiposEnsayoController);
