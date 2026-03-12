import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { Ensayo } from '../entities/ensayo.entity';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacion, Ensayo, Usuario]),
  ],
  providers: [NotificacionesService],
  controllers: [NotificacionesController],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
