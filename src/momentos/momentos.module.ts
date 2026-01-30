import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MomentosService } from './momentos.service';
import { MomentosController } from './momentos.controller';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { Parcela } from '../entities/parcela.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MomentoEvaluacion, DatosCampo, Parcela])],
  controllers: [MomentosController],
  providers: [MomentosService],
})
export class MomentosModule {}
