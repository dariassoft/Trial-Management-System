import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosSiembra } from '../entities/datos-siembra.entity';
import { DatosSiembraService } from './datos-siembra.service';
import { DatosSiembraController } from './datos-siembra.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DatosSiembra])],
  controllers: [DatosSiembraController],
  providers: [DatosSiembraService],
  exports: [DatosSiembraService],
})
export class DatosSiembraModule {}

