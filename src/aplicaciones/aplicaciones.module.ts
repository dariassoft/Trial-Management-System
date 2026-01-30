import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AplicacionesService } from './aplicaciones.service';
import { AplicacionesController } from './aplicaciones.controller';
import { Aplicacion } from '../entities/aplicacion.entity';
import { Ensayo } from '../entities/ensayo.entity';
import { TipoEnsayoEvaluacionDia } from '../entities/tipo-ensayo-evaluacion-dia.entity';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Aplicacion, Ensayo, TipoEnsayoEvaluacionDia, MomentoEvaluacion])],
  controllers: [AplicacionesController],
  providers: [AplicacionesService],
})
export class AplicacionesModule {}
