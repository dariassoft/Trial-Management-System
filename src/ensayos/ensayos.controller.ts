import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { EnsayosService } from './ensayos.service';
import { CreateEnsayoDto } from './dto/create-ensayo.dto';
import { UpdateEnsayoDto } from './dto/update-ensayo.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiQuery, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { Ensayo } from '../entities/ensayo.entity';
import { PageQueryDto } from '../common/dto/pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('ensayos')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('ensayos')
export class EnsayosController {
  constructor(private readonly ensayosService: EnsayosService) {}

  @Roles(Role.TECNICO, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ensayo' })
  @ApiCreatedResponse({ type: Ensayo, description: 'El ensayo ha sido creado exitosamente.' })
  @ApiBody({
    type: CreateEnsayoDto,
    examples: {
      'Payload Completo': {
        summary: 'Ejemplo con todos los campos posibles',
        value: {
          nombreEnsayo: 'Ensayo de Maíz Tardío 2025',
          protocoloId: 2,
          codigoLabor: 'LAB-2025-003',
          laboratorioId: 1,
          tipoEnsayoId: 4,
          responsableId: 5,
          provincia: 'Córdoba',
          departamento: 'Río Cuarto',
          establecimiento: 'El Progreso',
          lote: 'Lote 7A',
          latitud: -33.1306,
          longitud: -64.349,
          cultivoId: 1,
          variedadId: 1,
          tipoSiembraId: 1,
          distSurcosCm: 52.5,
          filas: 3,
          columnas: 4,
          fechaInicio: '2025-12-10',
          fechaSiembra: '2025-12-15',
          fechaCosecha: '2026-05-20',
          status: 'Por Iniciar',
        } as CreateEnsayoDto,
      },
    },
  })
  create(@Body() dto: CreateEnsayoDto) {
    return this.ensayosService.create(dto);
  }

  @Get('select')
  @ApiOperation({ summary: 'Buscar ensayos para un select/autocomplete' })
  @ApiOkResponse({ description: 'Lista de ensayos que coinciden con el término de búsqueda.', isArray: true })
  @ApiQuery({ name: 'term', required: false, type: String, description: 'Término de búsqueda (mínimo 3 caracteres).' })
  findForSelect(@Query('term') term: string) {
    return this.ensayosService.findForSelect(term);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los ensayos (paginado y filtrado)' })
  @ApiOkResponse({ description: 'Lista paginada de ensayos.', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página a obtener.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de resultados por página.' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo para ordenar (ej: id, nombreEnsayo, responsable.nombre)' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'], description: 'Orden de clasificación (Ascendente o Descendente).' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Búsqueda por nombre de ensayo, nombre de responsable o especie de cultivo.' })
  @ApiQuery({ name: 'laboratorio', required: false, type: String, description: 'Filtrar por nombre de laboratorio.' })
  @ApiQuery({ name: 'variedad', required: false, type: String, description: 'Filtrar por nombre de variedad.' })
  @ApiQuery({ name: 'fechaSiembraStart', required: false, type: String, description: 'Fecha de siembra inicio (YYYY-MM-DD).' })
  @ApiQuery({ name: 'fechaSiembraEnd', required: false, type: String, description: 'Fecha de siembra fin (YYYY-MM-DD).' })
  findAll(@Query() query: PageQueryDto & { q?: string; laboratorio?: string; variedad?: string; fechaSiembraStart?: string; fechaSiembraEnd?: string; }) {
    return this.ensayosService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ensayo por su ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID único del ensayo.' })
  @ApiOkResponse({ type: Ensayo, description: 'Detalles del ensayo solicitado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ensayosService.findOne(id);
  }

  @Roles(Role.TECNICO, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un ensayo existente por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID único del ensayo a actualizar.' })
  @ApiOkResponse({ type: Ensayo, description: 'El ensayo ha sido actualizado exitosamente.' })
  @ApiBody({
    type: UpdateEnsayoDto,
    examples: {
      'Actualización Completa': {
        summary: 'Ejemplo actualizando todos los campos posibles',
        value: {
          nombreEnsayo: 'Ensayo de Girasol 2025 (Corregido)',
          protocoloId: 3,
          codigoLabor: 'LAB-2025-004-MOD',
          laboratorioId: 2,
          tipoEnsayoId: 5,
          responsableId: 6,
          provincia: 'Santa Fe',
          departamento: 'General López',
          establecimiento: 'La Perseverancia',
          lote: 'Lote 12B',
          latitud: -33.754,
          longitud: -61.96,
          cultivoId: 2,
          variedadId: 2,
          tipoSiembraId: 2,
          distSurcosCm: 70,
          fechaInicio: '2025-10-15',
          fechaSiembra: '2025-10-20',
          fechaCosecha: '2026-04-25',
          statusId: 2,
        } as UpdateEnsayoDto,
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnsayoDto) {
    return this.ensayosService.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ensayo por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID único del ensayo a eliminar.' })
  @ApiOkResponse({ description: 'El ensayo ha sido eliminado exitosamente.', schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ensayosService.remove(id);
  }
}
