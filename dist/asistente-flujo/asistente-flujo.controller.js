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
exports.AsistenteFlujoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const asistente_flujo_service_1 = require("./asistente-flujo.service");
const estado_flujo_dto_1 = require("./dto/estado-flujo.dto");
let AsistenteFlujoController = class AsistenteFlujoController {
    constructor(asistenteFlujoService) {
        this.asistenteFlujoService = asistenteFlujoService;
    }
    getPrerequisitos() {
        return this.asistenteFlujoService.getPrerequisitos();
    }
    getEstado(ensayoId) {
        return this.asistenteFlujoService.getEstado(ensayoId);
    }
};
exports.AsistenteFlujoController = AsistenteFlujoController;
__decorate([
    (0, common_1.Get)('prerequisitos'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verificar prerequisitos globales para crear un ensayo',
        description: 'Devuelve el estado de todos los prerequisitos necesarios antes de crear un ensayo: laboratorios, productos, tipos de ensayo, variables y protocolos.',
    }),
    (0, swagger_1.ApiOkResponse)({ type: estado_flujo_dto_1.PrerequisitosResponseDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AsistenteFlujoController.prototype, "getPrerequisitos", null);
__decorate([
    (0, common_1.Get)('estado/:ensayoId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener estado del flujo de trabajo de un ensayo',
        description: 'Devuelve todos los pasos del flujo de trabajo con su estado de completitud, progreso y siguiente paso a completar.',
    }),
    (0, swagger_1.ApiParam)({ name: 'ensayoId', type: Number, description: 'ID del ensayo' }),
    (0, swagger_1.ApiOkResponse)({ type: estado_flujo_dto_1.EstadoFlujoResponseDto }),
    __param(0, (0, common_1.Param)('ensayoId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AsistenteFlujoController.prototype, "getEstado", null);
exports.AsistenteFlujoController = AsistenteFlujoController = __decorate([
    (0, swagger_1.ApiTags)('asistente-flujo'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'No autenticado' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Prohibido' }),
    (0, common_1.Controller)('asistente-flujo'),
    __metadata("design:paramtypes", [asistente_flujo_service_1.AsistenteFlujoService])
], AsistenteFlujoController);
