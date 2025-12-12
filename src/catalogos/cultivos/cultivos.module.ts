import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivosService } from './cultivos.service';
import { CultivosController } from './cultivos.controller';
import { Cultivo } from '../../entities/cultivo.entity';
import { CultivoVariedad } from '../../entities/cultivo-variedad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo, CultivoVariedad])],
  controllers: [CultivosController],
  providers: [CultivosService],
})
export class CultivosModule {}
