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
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';
import { ImportacionEnsayoLog } from '../entities/importacion-ensayo-log.entity';
import { ImportacionReportesService } from './importacion-reportes.service';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [
    NotificacionesModule,
    TypeOrmModule.forFeature([
      Ensayo,
      Parcela,
      DatosCampo,
      DatosCampoMedicion,
      DatosCosecha,
      Tratamiento,
      Bloque,
      Aplicacion,
      ProtocoloVariable,
      MomentoEvaluacion,
      ImportacionEnsayoLog,
    ]),
  ],
  controllers: [ReportesController],
  providers: [
    ReportesService,
    CalculosReportesService,
    ReportesEspecializadosService,
    SvgChartsService,
    ImportacionReportesService,
  ],
  exports: [ReportesService, CalculosReportesService, ReportesEspecializadosService, SvgChartsService, ImportacionReportesService],
})
export class ReportesModule {}

