import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivoVariedadesService } from './cultivo-variedades.service';
import { CultivoVariedadesController } from './cultivo-variedades.controller';
import { CultivoVariedad } from '../../entities/cultivo-variedad.entity';
import { Cultivo } from '../../entities/cultivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CultivoVariedad, Cultivo])],
  controllers: [CultivoVariedadesController],
  providers: [CultivoVariedadesService],
})
export class CultivoVariedadesModule {}
