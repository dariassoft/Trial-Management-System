import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TratamientosProductoService } from './tratamientos-producto.service';
import { TratamientosProductoController } from './tratamientos-producto.controller';
import { TratamientoProducto } from '../entities/tratamiento-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TratamientoProducto])],
  controllers: [TratamientosProductoController],
  providers: [TratamientosProductoService],
})
export class TratamientosProductoModule {}
