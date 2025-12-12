import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MomentosService } from './momentos.service';
import { MomentosController } from './momentos.controller';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MomentoEvaluacion])],
  controllers: [MomentosController],
  providers: [MomentosService],
})
export class MomentosModule {}
