import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSiembra } from '../../entities/tipo-siembra.entity';
import { TiposSiembraController } from './tipos-siembra.controller';
import { TiposSiembraService } from './tipos-siembra.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSiembra])],
  controllers: [TiposSiembraController],
  providers: [TiposSiembraService],
})
export class TiposSiembraModule {}
