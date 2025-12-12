import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
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
  @ApiOkResponse({ type: MomentoEvaluacion, isArray: true })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener momento de evaluación por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: MomentoEvaluacion })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
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
