import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsistenteFlujoController } from './asistente-flujo.controller';
import { AsistenteFlujoService } from './asistente-flujo.service';
import { Ensayo } from '../entities/ensayo.entity';
import { Bloque } from '../entities/bloque.entity';
import { Parcela } from '../entities/parcela.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosSiembra } from '../entities/datos-siembra.entity';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { Protocolo } from '../entities/protocolo.entity';
import { Tratamiento } from '../entities/tratamiento.entity';
import { TratamientoProducto } from '../entities/tratamiento-producto.entity';
import { Laboratorio } from '../entities/laboratorio.entity';
import { Producto } from '../entities/producto.entity';
import { TipoEnsayo } from '../entities/tipo-ensayo.entity';
import { TipoEnsayoVariable } from '../entities/tipo-ensayo-variable.entity';
import { TipoEnsayoEvaluacionDia } from '../entities/tipo-ensayo-evaluacion-dia.entity';
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';
import { Aplicacion } from '../entities/aplicacion.entity';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ensayo,
      Bloque,
      Parcela,
      DatosCampo,
      DatosSiembra,
      DatosCosecha,
      Protocolo,
      Tratamiento,
      TratamientoProducto,
      Laboratorio,
      Producto,
      TipoEnsayo,
      TipoEnsayoVariable,
      TipoEnsayoEvaluacionDia,
      ProtocoloVariable,
      Aplicacion,
      MomentoEvaluacion,
    ]),
  ],
  controllers: [AsistenteFlujoController],
  providers: [AsistenteFlujoService],
})
export class AsistenteFlujoModule {}

