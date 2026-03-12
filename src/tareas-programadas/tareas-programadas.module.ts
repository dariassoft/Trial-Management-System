import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TareasProgramadasService } from './tareas-programadas.service';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificacionesModule,
  ],
  providers: [TareasProgramadasService],
  exports: [TareasProgramadasService],
})
export class TareasProgramadasModule {}
