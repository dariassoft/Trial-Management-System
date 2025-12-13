import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnsayosService } from './ensayos.service';
import { EnsayosController } from './ensayos.controller';
import { Ensayo } from '../entities/ensayo.entity';
import { Laboratorio } from '../entities/laboratorio.entity';
import { TipoEnsayo } from '../entities/tipo-ensayo.entity';
import { Protocolo } from '../entities/protocolo.entity';
import { Usuario } from '../entities/usuario.entity';
import { Cultivo } from '../entities/cultivo.entity';
import { CultivoVariedad } from '../entities/cultivo-variedad.entity';
import { TipoSiembra } from '../entities/tipo-siembra.entity';
import { StatusEnsayo } from '../entities/status-ensayo.entity';
import { ProtocolosModule } from '../protocolos/protocolos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ensayo, 
      Laboratorio, 
      TipoEnsayo, 
      Protocolo, 
      Usuario,
      Cultivo,
      CultivoVariedad,
      TipoSiembra,
      StatusEnsayo,
    ]),
    ProtocolosModule,
  ],
  controllers: [EnsayosController],
  providers: [EnsayosService],
})
export class EnsayosModule {}
