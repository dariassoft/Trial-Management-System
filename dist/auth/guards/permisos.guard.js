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
exports.PermisosGuard = void 0;
const common_1 = require("@nestjs/common");
const permisos_service_1 = require("../../permisos/permisos.service");
const permiso_entity_1 = require("../../entities/permiso.entity");
let PermisosGuard = class PermisosGuard {
    constructor(permisosService) {
        this.permisosService = permisosService;
    }
    canActivate(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = context.switchToHttp().getRequest();
            const user = request.user;
            if (!user || !user.rol_id) {
                throw new common_1.ForbiddenException('Usuario no autenticado');
            }
            // Obtener recurso y acción del request
            const { recurso, accion } = this.extractRecursoAndAccion(request);
            if (!recurso || !accion) {
                // Si no se puede determinar, permitir (permisos opcionales)
                return true;
            }
            // Verificar si el usuario tiene el permiso
            const tienePermiso = yield this.permisosService.hasPermiso(user.rol_id, recurso, accion);
            if (!tienePermiso) {
                throw new common_1.ForbiddenException(`No tiene permiso para ${accion} en ${recurso}`);
            }
            return true;
        });
    }
    extractRecursoAndAccion(request) {
        const method = request.method;
        const path = request.path;
        // Mapear ruta a recurso
        const recurso = this.extractRecurso(path);
        // Mapear método HTTP a acción
        const accion = this.mapMethodToAccion(method);
        return { recurso, accion };
    }
    extractRecurso(path) {
        // /api/v1/laboratorios -> laboratorios
        // /api/v1/usuarios -> usuarios
        // /api/v1/productos -> productos
        // /api/v1/catalogos/cultivos -> cultivos
        // /api/v1/catalogos/variedades -> variedades
        // etc
        const parts = path.split('/').filter((p) => p && p !== 'api' && p !== 'v1');
        if (parts.length === 0)
            return undefined;
        // Si es /catalogos/cultivos, retornar 'cultivos'
        if (parts[0] === 'catalogos' && parts[1]) {
            return parts[1]; // cultivos, variedades, tipos-ensayo, tipos-siembra
        }
        // Si es /laboratorios, /usuarios, etc
        return parts[0];
    }
    mapMethodToAccion(method) {
        switch (method) {
            case 'GET':
                return permiso_entity_1.AccionPermiso.VER; // O LISTAR si es un GET al root
            case 'POST':
                return permiso_entity_1.AccionPermiso.CREAR;
            case 'PATCH':
            case 'PUT':
                return permiso_entity_1.AccionPermiso.EDITAR;
            case 'DELETE':
                return permiso_entity_1.AccionPermiso.ELIMINAR;
            default:
                return undefined;
        }
    }
};
exports.PermisosGuard = PermisosGuard;
exports.PermisosGuard = PermisosGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [permisos_service_1.PermisosService])
], PermisosGuard);
