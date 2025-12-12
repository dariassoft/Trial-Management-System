import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiposEnsayoService } from './tipos-ensayo.service';
import { TiposEnsayoController } from './tipos-ensayo.controller';
import { TipoEnsayo } from '../../entities/tipo-ensayo.entity';
import { TipoEnsayoVariable } from '../../entities/tipo-ensayo-variable.entity';
import { ProtocoloVariable } from '../../entities/protocolo-variable.entity';
import { TipoEnsayoEvaluacionDia } from '../../entities/tipo-ensayo-evaluacion-dia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoEnsayo, TipoEnsayoVariable, ProtocoloVariable, TipoEnsayoEvaluacionDia])],
  controllers: [TiposEnsayoController],
  providers: [TiposEnsayoService],
  exports: [TiposEnsayoService],
})
export class TiposEnsayoModule {}
