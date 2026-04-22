import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosSiembra } from '../entities/datos-siembra.entity';
import { DatosSiembraService } from './datos-siembra.service';
import { DatosSiembraController } from './datos-siembra.controller';
import { Parcela } from '../entities/parcela.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatosSiembra, Parcela])],
  controllers: [DatosSiembraController],
  providers: [DatosSiembraService],
  exports: [DatosSiembraService],
})
export class DatosSiembraModule {}
