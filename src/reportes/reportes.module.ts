import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { Ensayo } from '../entities/ensayo.entity';
import { Parcela } from '../entities/parcela.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosCampoMedicion } from '../entities/datos-campo-medicion.entity';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { Tratamiento } from '../entities/tratamiento.entity';
import { Bloque } from '../entities/bloque.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ensayo,
      Parcela,
      DatosCampo,
      DatosCampoMedicion,
      DatosCosecha,
      Tratamiento,
      Bloque,
    ]),
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}

