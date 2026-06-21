import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloquesService } from './bloques.service';
import { BloquesController } from './bloques.controller';
import { Bloque } from '../entities/bloque.entity';
import { Ensayo } from '../entities/ensayo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bloque, Ensayo])],
  controllers: [BloquesController],
  providers: [BloquesService],
})
export class BloquesModule {}
