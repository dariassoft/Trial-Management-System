import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class TareasProgramadasService {
  private readonly logger = new Logger(TareasProgramadasService.name);

  constructor(
    private readonly notificacionesService: NotificacionesService,
  ) {}

  /**
   * Cron job diario a las 08:00 AM - genera notificaciones para todos los usuarios.
   */
  @Cron('0 8 * * *')
  async handleDailyNotifications(): Promise<void> {
    this.logger.log('⏰ Ejecutando tarea programada: generación diaria de notificaciones');
    try {
      await this.notificacionesService.generateForAllUsers();
      this.logger.log('✅ Generación diaria de notificaciones completada');
    } catch (error) {
      this.logger.error('❌ Error en generación diaria de notificaciones', error);
    }
  }
}
