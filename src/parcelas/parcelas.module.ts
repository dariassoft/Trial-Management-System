import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelasService } from './parcelas.service';
import { ParcelasController } from './parcelas.controller';
import { Parcela } from '../entities/parcela.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parcela])],
  controllers: [ParcelasController],
  providers: [ParcelasService],
})
export class ParcelasModule {}
