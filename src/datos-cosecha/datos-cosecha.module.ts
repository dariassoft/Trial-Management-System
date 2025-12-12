import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { DatosCosechaService } from './datos-cosecha.service';
import { DatosCosechaController } from './datos-cosecha.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DatosCosecha])],
  controllers: [DatosCosechaController],
  providers: [DatosCosechaService],
})
export class DatosCosechaModule {}
