import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MomentosService } from './momentos.service';
import { CreateMomentoDto } from './dto/create-momento.dto';
import { UpdateMomentoDto } from './dto/update-momento.dto';
import { MomentoEvaluacion } from '../entities/momento-evaluacion.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('momentos')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('momentos')
export class MomentosController {
  constructor(private readonly service: MomentosService) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un momento de evaluación' })
  @ApiCreatedResponse({ type: MomentoEvaluacion, description: 'Momento creado' })
  @ApiBody({
    type: CreateMomentoDto,
    examples: {
      default: {
        value: {
          aplicacionId: 1,
          nombreMomento: '7DDA',
          diasDespuesAplicacion: 7,
          fechaEvaluacion: '2025-04-01',
        },
      },
    },
  })
  create(@Body() dto: CreateMomentoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar momentos de evaluación' })
  @ApiQuery({ name: 'aplicacionId', required: false, type: Number, description: 'Filtrar por aplicación' })
  @ApiOkResponse({ type: MomentoEvaluacion, isArray: true })
  findAll(@Query('aplicacionId') aplicacionId?: string) {
    return this.service.findAll({ aplicacionId: aplicacionId ? parseInt(aplicacionId, 10) : undefined });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener momento de evaluación por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: MomentoEvaluacion })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':id/progreso')
  @ApiOperation({ summary: 'Obtener progreso de un momento (parcelas medidas vs pendientes)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    schema: {
      example: {
        momentoId: 1,
        nombreMomento: '7 DDA',
        diasDespuesAplicacion: 7,
        fechaEvaluacion: '2025-04-01',
        totalParcelas: 48,
        parcelasMedidas: 24,
        parcelasPendientes: 24,
        porcentaje: 50,
        estado: 'en_progreso',
        idsParcelasMedidas: [1, 2, 3]
      }
    }
  })
  getProgreso(@Param('id', ParseIntPipe) id: number) {
    return this.service.getProgreso(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar momento de evaluación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: MomentoEvaluacion })
  @ApiBody({
    type: UpdateMomentoDto,
    examples: {
      default: {
        value: {
          nombreMomento: '14DDA',
          diasDespuesAplicacion: 14,
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMomentoDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar momento de evaluación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
