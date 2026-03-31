import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TiposSiembraService } from './tipos-siembra.service';
import { CreateTipoSiembraDto } from './dto/create-tipo-siembra.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../entities/rol.entity';

@ApiTags('Catálogo - Tipos de Siembra')
@ApiBearerAuth()
@Controller('catalogos/tipos-siembra')
export class TiposSiembraController {
  constructor(private readonly service: TiposSiembraService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER, Role.TECNICO)
  @ApiOperation({ summary: 'Crear un tipo de siembra' })
  @ApiResponse({ status: 201, description: 'Tipo de siembra creado' })
  create(@Body() dto: CreateTipoSiembraDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de siembra con paginación y búsqueda' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'q', required: false, type: String })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('q') q?: string,
  ) {
    return this.service.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sort: sort || 'nombre',
      order: (order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
      q,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de siembra por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER, Role.TECNICO)
  @ApiOperation({ summary: 'Actualizar un tipo de siembra' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateTipoSiembraDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Eliminar un tipo de siembra' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
