import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { CalculosReportesService } from './calculos-reportes.service';
import { ReportesEspecializadosService } from './reportes-especializados.service';
import { SvgChartsService } from './svg-charts.service';
import { Ensayo } from '../entities/ensayo.entity';
import { Parcela } from '../entities/parcela.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosCampoMedicion } from '../entities/datos-campo-medicion.entity';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { Tratamiento } from '../entities/tratamiento.entity';
import { Bloque } from '../entities/bloque.entity';
import { Aplicacion } from '../entities/aplicacion.entity';

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
      Aplicacion,
    ]),
  ],
  controllers: [ReportesController],
  providers: [
    ReportesService,
    CalculosReportesService,
    ReportesEspecializadosService,
    SvgChartsService,
  ],
  exports: [ReportesService, CalculosReportesService, ReportesEspecializadosService, SvgChartsService],
})
export class ReportesModule {}

