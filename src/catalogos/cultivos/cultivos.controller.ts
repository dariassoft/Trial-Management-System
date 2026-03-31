import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CultivosService } from './cultivos.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../entities/rol.entity';

@ApiTags('Catálogo - Cultivos')
@ApiBearerAuth()
@Controller('catalogos/cultivos')
export class CultivosController {
  constructor(private readonly cultivosService: CultivosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER, Role.TECNICO)
  @ApiOperation({ summary: 'Crear un nuevo cultivo' })
  @ApiResponse({ status: 201, description: 'Cultivo creado' })
  create(@Body() createCultivoDto: CreateCultivoDto) {
    return this.cultivosService.create(createCultivoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cultivos con paginación y búsqueda' })
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
    return this.cultivosService.findAll({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sort: sort || 'nombre',
      order: (order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC') as 'ASC' | 'DESC',
      q,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cultivo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.findOne(id);
  }

  @Get(':id/variedades')
  @ApiOperation({ summary: 'Obtener todas las variedades de un cultivo específico' })
  findVariedadesPorCultivo(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.findVariedadesPorCultivo(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER, Role.TECNICO)
  @ApiOperation({ summary: 'Actualizar un cultivo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCultivoDto: UpdateCultivoDto) {
    return this.cultivosService.update(id, updateCultivoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Eliminar un cultivo (y sus variedades)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cultivosService.remove(id);
  }
}
