import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatosCampo } from '../entities/datos-campo.entity';
import { DatosCampoService } from './datos-campo.service';
import { DatosCampoController } from './datos-campo.controller';
import { DatosCampoMedicion } from '../entities/datos-campo-medicion.entity';
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';
import { FotosModule } from '../fotos/fotos.module';

@Module({
  imports: [TypeOrmModule.forFeature([DatosCampo, DatosCampoMedicion, ProtocoloVariable]), FotosModule],
  controllers: [DatosCampoController],
  providers: [DatosCampoService],
})
export class DatosCampoModule {}
