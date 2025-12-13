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
exports.StatusEnsayoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const status_ensayo_service_1 = require("./status-ensayo.service");
const status_ensayo_entity_1 = require("../entities/status-ensayo.entity");
let StatusEnsayoController = class StatusEnsayoController {
    constructor(statusService) {
        this.statusService = statusService;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.statusService.findAll();
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.statusService.findById(id);
        });
    }
};
exports.StatusEnsayoController = StatusEnsayoController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los estados de ensayo disponibles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de estados', type: [status_ensayo_entity_1.StatusEnsayo] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatusEnsayoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un estado de ensayo por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado encontrado', type: status_ensayo_entity_1.StatusEnsayo }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Estado no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatusEnsayoController.prototype, "findOne", null);
exports.StatusEnsayoController = StatusEnsayoController = __decorate([
    (0, swagger_1.ApiTags)('Status Ensayos'),
    (0, common_1.Controller)('status-ensayos'),
    __metadata("design:paramtypes", [status_ensayo_service_1.StatusEnsayoService])
], StatusEnsayoController);
