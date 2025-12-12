import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AplicacionesService } from './aplicaciones.service';
import { AplicacionesController } from './aplicaciones.controller';
import { Aplicacion } from '../entities/aplicacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aplicacion])],
  controllers: [AplicacionesController],
  providers: [AplicacionesService],
})
export class AplicacionesModule {}
