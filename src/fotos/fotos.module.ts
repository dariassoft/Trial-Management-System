import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FotoRegistro } from '../entities/foto-registro.entity';
import { DatosCampo } from '../entities/datos-campo.entity';
import { FotosService } from './fotos.service';
import { FotosController } from './fotos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FotoRegistro, DatosCampo])],
  controllers: [FotosController],
  providers: [FotosService],
  exports: [FotosService],
})
export class FotosModule {}
