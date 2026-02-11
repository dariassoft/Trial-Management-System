import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('roles')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear rol' })
  @ApiCreatedResponse({ description: 'Rol creado', schema: { example: {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso administrativo completo'
  } } })
  @ApiBody({ type: CreateRolDto, examples: { default: { value: {
    nombre: 'Administrador',
    descripcion: 'Acceso administrativo completo'
  } } } })
  create(@Body() dto: CreateRolDto) {
    return this.service.create(dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get()
  @ApiOperation({ summary: 'Listar roles (paginado y filtrado)' })
  @ApiOkResponse({ description: 'Lista paginada de roles', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campos permitidos: id, nombre' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'] })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Buscar por nombre o descripción' })
  findAll(@Query() query: { page?: number; limit?: number; sort?: string; order?: 'ASC'|'DESC'; q?: string; }) {
    return this.service.findAll(query);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Rol', schema: { example: {
    id: 1,
    nombre: 'Administrador',
    descripcion: 'Acceso administrativo completo',
    usuariosCount: 5
  } } })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar rol' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Rol actualizado' })
  @ApiBody({ type: UpdateRolDto, examples: { default: { value: {
    nombre: 'Gerente de Proyecto',
    descripcion: 'Acceso a proyectos asignados'
  } } } })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar rol' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

