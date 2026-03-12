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
var TareasProgramadasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TareasProgramadasService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const notificaciones_service_1 = require("../notificaciones/notificaciones.service");
let TareasProgramadasService = TareasProgramadasService_1 = class TareasProgramadasService {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
        this.logger = new common_1.Logger(TareasProgramadasService_1.name);
    }
    /**
     * Cron job diario a las 08:00 AM - genera notificaciones para todos los usuarios.
     */
    handleDailyNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('⏰ Ejecutando tarea programada: generación diaria de notificaciones');
            try {
                yield this.notificacionesService.generateForAllUsers();
                this.logger.log('✅ Generación diaria de notificaciones completada');
            }
            catch (error) {
                this.logger.error('❌ Error en generación diaria de notificaciones', error);
            }
        });
    }
};
exports.TareasProgramadasService = TareasProgramadasService;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TareasProgramadasService.prototype, "handleDailyNotifications", null);
exports.TareasProgramadasService = TareasProgramadasService = TareasProgramadasService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], TareasProgramadasService);
