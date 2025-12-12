import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtocoloVariablesService } from './protocolo-variables.service';
import { ProtocoloVariablesController } from './protocolo-variables.controller';
import { ProtocoloVariable } from '../entities/protocolo-variable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProtocoloVariable])],
  controllers: [ProtocoloVariablesController],
  providers: [ProtocoloVariablesService],
})
export class ProtocoloVariablesModule {}
