import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloquesService } from './bloques.service';
import { BloquesController } from './bloques.controller';
import { Bloque } from '../entities/bloque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bloque])],
  controllers: [BloquesController],
  providers: [BloquesService],
})
export class BloquesModule {}
