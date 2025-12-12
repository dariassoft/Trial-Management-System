import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { LaboratoriosService } from './laboratorios.service';
import { CreateLaboratorioDto } from './dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from './dto/update-laboratorio.dto';
import { Laboratorio } from '../entities/laboratorio.entity';
import { PageQueryDto } from '../common/dto/pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('laboratorios')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('laboratorios')
export class LaboratoriosController {
  constructor(private readonly service: LaboratoriosService) {}

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un laboratorio' })
  @ApiCreatedResponse({ type: Laboratorio, description: 'Laboratorio creado' })
  @ApiBody({
    type: CreateLaboratorioDto,
    examples: {
      default: {
        summary: 'Laboratorio básico',
        value: {
          nombre: 'ACME Agro Labs',
        },
      },
    },
  })
  create(@Body() dto: CreateLaboratorioDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar laboratorios (paginado y filtrado)' })
  @ApiOkResponse({ description: 'Lista paginada', schema: { example: { data: [], meta: { total: 0, page: 1, limit: 10, pageCount: 0 } } } })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'] })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Buscar por nombre' })
  findAll(@Query() query: PageQueryDto & { q?: string }) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener laboratorio por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Laboratorio })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar laboratorio' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Laboratorio })
  @ApiBody({
    type: UpdateLaboratorioDto,
    examples: {
      default: {
        value: {
          nombre: 'Nuevo nombre de laboratorio',
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLaboratorioDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar laboratorio' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
