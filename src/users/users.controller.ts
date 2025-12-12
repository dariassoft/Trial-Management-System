import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignLabsDto } from './dto/assign-labs.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('usuarios')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  @ApiCreatedResponse({ description: 'Usuario creado (sin password en la respuesta)', schema: { example: {
    id: 10,
    username: 'user@example.com',
    nombre: 'María',
    apellido: 'Pérez',
    telefono: '3875789133',
    fecha_nacimiento: '1990-05-21',
    esta_activo: true,
    rol: { id: 2, nombre: 'Administrador' },
    laboratoriosAsignados: [ { id: 1, laboratorio: { id: 1, nombre: 'ACME Agro Labs' } } ]
  } } })
  @ApiBody({ type: CreateUserDto, examples: { default: { value: {
    username: 'user@example.com', password: 'S3gura123', rolId: 2,
    nombre: 'María', apellido: 'Pérez', telefono: '3875789133', fecha_nacimiento: '1990-05-21',
    esta_activo: true, laboratorioIds: [1,2]
  } } } })
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar usuarios (paginado y filtrado)' })
  @ApiOkResponse({ description: 'Lista paginada de usuarios', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campos permitidos: id, username, esta_activo' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'] })
  @ApiQuery({ name: 'rolId', required: false, type: Number })
  @ApiQuery({ name: 'activo', required: false, type: Boolean })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Buscar por username/nombre/apellido/teléfono' })
  findAll(@Query() query: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC'; rolId?: number; activo?: boolean; q?: string; }) {
    return this.service.findAll(query);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Usuario', schema: { example: {
    id: 10, username: 'user@example.com', nombre: 'María', apellido: 'Pérez', telefono: '3875789133', esta_activo: true,
    rol: { id: 2, nombre: 'Administrador' }, laboratoriosAsignados: [ { id: 1, laboratorio: { id: 1, nombre: 'ACME Agro Labs' } } ]
  } } })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Usuario actualizado (sin password en la respuesta)' })
  @ApiBody({ type: UpdateUserDto, examples: { default: { value: {
    password: 'NuevaP4ss', rolId: 3, nombre: 'Maria', telefono: '3875000000', esta_activo: true
  } } } })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post(':id/laboratorios')
  @ApiOperation({ summary: 'Asignar laboratorios a un usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Usuario con laboratorios actualizados' })
  @ApiBody({ type: AssignLabsDto, examples: { default: { value: { laboratorioIds: [1,2,3] } } } })
  addLabs(@Param('id', ParseIntPipe) id: number, @Body() body: AssignLabsDto) {
    return this.service.addLaboratorios(id, body.laboratorioIds);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id/laboratorios/:labId')
  @ApiOperation({ summary: 'Quitar un laboratorio del usuario' })
  @ApiParam({ name: 'id', type: Number })
  @ApiParam({ name: 'labId', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  removeLab(@Param('id', ParseIntPipe) id: number, @Param('labId', ParseIntPipe) labId: number) {
    return this.service.removeLaboratorio(id, labId);
  }
}
