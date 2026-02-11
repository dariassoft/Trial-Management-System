import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { LaboratoriosService } from './laboratorios.service';
import { CreateLaboratorioDto } from './dto/create-laboratorio.dto';
import { UpdateLaboratorioDto } from './dto/update-laboratorio.dto';
import { Laboratorio } from '../entities/laboratorio.entity';
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
  @ApiCreatedResponse({
    type: Laboratorio,
    description: 'Laboratorio creado',
    schema: { example: {
      id: 1,
      nombre: 'ACME Agro Labs',
      descripcion: 'Laboratorio de análisis de suelos',
      direccion: 'Calle Principal 123',
      telefono: '3875789133',
      email: 'lab@acme.com',
      contacto: 'Ing. Juan Pérez',
      esta_activo: true,
      createdAt: '2026-02-11T10:00:00Z',
      updatedAt: '2026-02-11T10:00:00Z'
    } }
  })
  @ApiBody({
    type: CreateLaboratorioDto,
    examples: {
      default: {
        summary: 'Laboratorio completo',
        value: {
          nombre: 'ACME Agro Labs',
          descripcion: 'Laboratorio de análisis de suelos',
          direccion: 'Calle Principal 123, Ciudad',
          telefono: '3875789133',
          email: 'lab@acme.com',
          contacto: 'Ing. Juan Pérez',
          esta_activo: true,
        },
      },
      minimal: {
        summary: 'Solo nombre requerido',
        value: {
          nombre: 'Mi Laboratorio',
        },
      },
    },
  })
  create(@Body() dto: CreateLaboratorioDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar laboratorios (paginado y filtrado)' })
  @ApiOkResponse({
    description: 'Lista paginada de laboratorios',
    schema: {
      example: {
        data: [
          { id: 1, nombre: 'ACME Labs', descripcion: 'Lab principal', esta_activo: true }
        ],
        meta: { total: 1, page: 1, limit: 10, pageCount: 1 }
      }
    }
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página (default: 10)' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo para ordenar (default: id)' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'], description: 'Dirección de orden (default: ASC)' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Búsqueda por nombre, descripción, email o contacto' })
  @ApiQuery({ name: 'activo', required: false, type: Boolean, description: 'Filtrar por estado activo' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener laboratorio por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({
    type: Laboratorio,
    schema: { example: {
      id: 1,
      nombre: 'ACME Labs',
      descripcion: 'Lab principal',
      direccion: 'Calle Principal 123',
      telefono: '3875789133',
      email: 'lab@acme.com',
      contacto: 'Ing. Juan Pérez',
      esta_activo: true,
      usuariosAsignados: []
    } }
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar laboratorio' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Laboratorio, description: 'Laboratorio actualizado' })
  @ApiBody({
    type: UpdateLaboratorioDto,
    examples: {
      default: {
        summary: 'Actualización completa',
        value: {
          nombre: 'ACME Labs Actualizado',
          descripcion: 'Descripción actualizada',
          telefono: '3875000000',
          email: 'newemail@acme.com',
          esta_activo: true,
        },
      },
      partial: {
        summary: 'Actualización parcial',
        value: {
          esta_activo: false,
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
  @ApiOkResponse({
    description: 'Laboratorio eliminado',
    schema: { example: { deleted: true } }
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
