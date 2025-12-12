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
exports.LocationsController = void 0;
const common_1 = require("@nestjs/common");
const locations_service_1 = require("./locations.service");
const swagger_1 = require("@nestjs/swagger");
let LocationsController = class LocationsController {
    constructor(locationsService) {
        this.locationsService = locationsService;
    }
    getProvincias() {
        return this.locationsService.getProvincias();
    }
    getDepartamentosByProvincia(provincia) {
        return this.locationsService.getDepartamentosByProvincia(provincia);
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)('provincias'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener listado de provincias' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listado de provincias', type: [String] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getProvincias", null);
__decorate([
    (0, common_1.Get)('provincias/:provincia/departamentos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener listado de departamentos para una provincia' }),
    (0, swagger_1.ApiParam)({ name: 'provincia', description: 'Nombre de la provincia' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listado de departamentos', type: [String] }),
    __param(0, (0, common_1.Param)('provincia')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "getDepartamentosByProvincia", null);
exports.LocationsController = LocationsController = __decorate([
    (0, swagger_1.ApiTags)('locations'),
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [locations_service_1.LocationsService])
], LocationsController);
