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
exports.NotificacionesController = void 0;
const common_1 = require("@nestjs/common");
const notificaciones_service_1 = require("./notificaciones.service");
const update_notificacion_dto_1 = require("./dto/update-notificacion.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NotificacionesController = class NotificacionesController {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }
    generarNotificaciones(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            yield this.notificacionesService.generateForUser(user.sub);
            return { message: 'Notificaciones generadas exitosamente.' };
        });
    }
    getUnreadCount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const count = yield this.notificacionesService.countUnread(user.sub);
            return { count };
        });
    }
    markAllAsRead(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            yield this.notificacionesService.markAllAsRead(user.sub);
            return { message: 'Todas las notificaciones marcadas como leídas.' };
        });
    }
    findAll(req) {
        const user = req.user;
        return this.notificacionesService.findAll(user.sub);
    }
    findOne(id, req) {
        const user = req.user;
        return this.notificacionesService.findOne(+id, user.sub);
    }
    update(id, updateDto, req) {
        const user = req.user;
        return this.notificacionesService.update(+id, updateDto, user.sub);
    }
    remove(id, req) {
        const user = req.user;
        return this.notificacionesService.remove(+id, user.sub);
    }
};
exports.NotificacionesController = NotificacionesController;
__decorate([
    (0, common_1.Post)('generar'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar notificaciones manualmente para el usuario actual' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "generarNotificaciones", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener cantidad de notificaciones sin leer' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Patch)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar todas las notificaciones como leídas' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las notificaciones del usuario actual' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una notificación por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una notificación (marcar como leída/no leída)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_notificacion_dto_1.UpdateNotificacionDto, Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una notificación' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificacionesController.prototype, "remove", null);
exports.NotificacionesController = NotificacionesController = __decorate([
    (0, swagger_1.ApiTags)('notificaciones'),
    (0, common_1.Controller)('notificaciones'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], NotificacionesController);
