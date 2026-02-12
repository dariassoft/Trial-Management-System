import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisosService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { Permiso } from '../entities/permiso.entity';
import { Rol } from '../entities/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permiso, Rol])],
  controllers: [PermisosController],
  providers: [PermisosService],
  exports: [PermisosService],
})
export class PermisosModule {}

