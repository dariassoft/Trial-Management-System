import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Protocolo } from '../entities/protocolo.entity';
import { ProtocolosController } from './protocolos.controller';
import { ProtocolosService } from './protocolos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Protocolo])],
  controllers: [ProtocolosController],
  providers: [ProtocolosService],
  exports: [ProtocolosService], // Exportar si otros módulos necesitan usarlo
})
export class ProtocolosModule {}
