import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TratamientosService } from './tratamientos.service';
import { TratamientosController } from './tratamientos.controller';
import { Tratamiento } from '../entities/tratamiento.entity';
import { Protocolo } from '../entities/protocolo.entity'; // Importar Protocolo
import { ProtocolosModule } from '../protocolos/protocolos.module'; // Importar ProtocolosModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Tratamiento, Protocolo]), // Añadir Protocolo
    ProtocolosModule, // Importar ProtocolosModule
  ],
  controllers: [TratamientosController],
  providers: [TratamientosService],
})
export class TratamientosModule {}
