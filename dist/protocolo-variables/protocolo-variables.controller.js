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
exports.ProtocoloVariablesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const protocolo_variables_service_1 = require("./protocolo-variables.service");
const update_protocolo_variable_dto_1 = require("./dto/update-protocolo-variable.dto");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const rol_entity_1 = require("../entities/rol.entity");
let ProtocoloVariablesController = class ProtocoloVariablesController {
    constructor(service) {
        this.service = service;
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
};
exports.ProtocoloVariablesController = ProtocoloVariablesController;
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(rol_entity_1.Role.ADMIN, rol_entity_1.Role.SUPERADMIN, rol_entity_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una variable de protocolo por su ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_protocolo_variable_dto_1.UpdateProtocoloVariableDto]),
    __metadata("design:returntype", void 0)
], ProtocoloVariablesController.prototype, "update", null);
exports.ProtocoloVariablesController = ProtocoloVariablesController = __decorate([
    (0, swagger_1.ApiTags)('Protocolo - Variables'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('protocolo-variables'),
    __metadata("design:paramtypes", [protocolo_variables_service_1.ProtocoloVariablesService])
], ProtocoloVariablesController);
