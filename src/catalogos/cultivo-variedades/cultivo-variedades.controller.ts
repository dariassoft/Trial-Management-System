import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CultivoVariedadesService } from './cultivo-variedades.service';
import { CreateCultivoVariedadDto } from './dto/create-cultivo-variedad.dto';
import { UpdateCultivoVariedadDto } from './dto/update-cultivo-variedad.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../entities/rol.entity';

@ApiTags('Catálogo - Variedades de Cultivo')
@ApiBearerAuth()
@Controller('catalogos/cultivo-variedades')
export class CultivoVariedadesController {
  constructor(private readonly cultivoVariedadesService: CultivoVariedadesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER, Role.TECNICO)
  @ApiOperation({ summary: 'Crear una nueva variedad (asignada a un cultivo)' })
  @ApiResponse({ status: 201, description: 'Variedad creada' })
  create(@Body() createCultivoVariedadDto: CreateCultivoVariedadDto) {
    return this.cultivoVariedadesService.create(createCultivoVariedadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar variedades con paginación y búsqueda' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'cultivoId', required: false, type: Number })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('q') q?: string,
    @Query('cultivoId') cultivoId?: string,
  ) {
    return this.cultivoVariedadesService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sort: sort || 'nombre',
      order: (order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
      q,
      cultivoId: cultivoId ? parseInt(cultivoId, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una variedad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cultivoVariedadesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER, Role.TECNICO)
  @ApiOperation({ summary: 'Actualizar una variedad' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCultivoVariedadDto: UpdateCultivoVariedadDto) {
    return this.cultivoVariedadesService.update(id, updateCultivoVariedadDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Eliminar una variedad' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cultivoVariedadesService.remove(id);
  }
}
