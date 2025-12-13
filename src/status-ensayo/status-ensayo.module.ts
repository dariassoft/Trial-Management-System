import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEnsayo } from '../entities/status-ensayo.entity';
import { StatusEnsayoService } from './status-ensayo.service';
import { StatusEnsayoController } from './status-ensayo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StatusEnsayo])],
  controllers: [StatusEnsayoController],
  providers: [StatusEnsayoService],
  exports: [StatusEnsayoService],
})
export class StatusEnsayoModule {}

