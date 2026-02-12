import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { Permiso, AccionPermiso } from '../entities/permiso.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('permisos')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  @Roles(Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un permiso' })
  @ApiCreatedResponse({ type: Permiso, description: 'Permiso creado' })
  create(@Body() createPermisoDto: CreatePermisoDto) {
    return this.permisosService.create(createPermisoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar permisos (paginado y filtrado)' })
  @ApiOkResponse({
    description: 'Lista paginada de permisos',
    schema: {
      example: {
        data: [],
        meta: { total: 0, page: 1, limit: 10, pageCount: 0 },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'rol_id', required: false, type: Number })
  @ApiQuery({ name: 'recurso', required: false, type: String })
  @ApiQuery({
    name: 'accion',
    required: false,
    enum: AccionPermiso,
  })
  findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      sort?: string;
      order?: 'ASC' | 'DESC';
      rol_id?: number;
      recurso?: string;
      accion?: AccionPermiso;
    },
  ) {
    return this.permisosService.findAll(query);
  }

  @Get('rol/:rol_id')
  @ApiOperation({ summary: 'Obtener todos los permisos de un rol' })
  @ApiParam({ name: 'rol_id', type: Number })
  findByRolId(@Param('rol_id', ParseIntPipe) rol_id: number) {
    return this.permisosService.findByRolId(rol_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un permiso por ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permisosService.findOne(id);
  }

  @Roles(Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un permiso' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermisoDto: UpdatePermisoDto,
  ) {
    return this.permisosService.update(id, updatePermisoDto);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un permiso' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permisosService.remove(id);
  }

  @Roles(Role.SUPERADMIN)
  @Post('rol/:rol_id/asignar-default')
  @ApiOperation({
    summary: 'Asignar permisos por defecto a un rol',
  })
  @ApiParam({ name: 'rol_id', type: Number })
  asignarPermisosDefault(@Param('rol_id', ParseIntPipe) rol_id: number) {
    return this.permisosService.asignarPermisosDefault(rol_id);
  }

  @Roles(Role.SUPERADMIN)
  @Post('init')
  @ApiOperation({
    summary: 'Inicializar permisos por defecto para TODOS los roles',
  })
  @ApiOkResponse({
    description: 'Permisos inicializados',
    schema: {
      example: {
        message: 'Permisos inicializados exitosamente',
        totalPermisosCreados: 100,
      },
    },
  })
  async initPermisos() {
    return this.permisosService.initAllPermisosDefault();
  }
}

