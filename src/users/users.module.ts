import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';
import { UsuarioLaboratorio } from '../entities/usuario-laboratorio.entity';
import { Laboratorio } from '../entities/laboratorio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol, UsuarioLaboratorio, Laboratorio])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
