import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TratamientosService } from './tratamientos.service';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';
import { Tratamiento } from '../entities/tratamiento.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('tratamientos')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('tratamientos')
export class TratamientosController {
  constructor(private readonly service: TratamientosService) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tratamiento' })
  @ApiCreatedResponse({ type: Tratamiento, description: 'Tratamiento creado exitosamente' })
  @ApiBody({
    type: CreateTratamientoDto,
    examples: {
      testigo: {
        summary: 'Tratamiento Testigo (control)',
        value: {
          protocoloId: 1,
          numeroTrat: 1,
          descripcion: 'Testigo (Sin aplicación)',
          esTestigo: true,
        },
      },
      conProducto: {
        summary: 'Tratamiento con producto',
        value: {
          protocoloId: 1,
          numeroTrat: 2,
          descripcion: 'Fomesafen 25% - 800 cc/ha - V4',
          esTestigo: false,
        },
      },
    },
  })
  create(@Body() dto: CreateTratamientoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tratamientos con búsqueda y filtros' })
  @ApiOkResponse({
    description: 'Lista de tratamientos',
    schema: {
      example: {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          pageCount: 0,
        },
      },
    },
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiQuery({ name: 'sort', type: String, required: false, example: 'numeroTrat' })
  @ApiQuery({ name: 'order', enum: ['ASC', 'DESC'], required: false, example: 'ASC' })
  @ApiQuery({ name: 'q', type: String, required: false, description: 'Búsqueda por descripción' })
  @ApiQuery({ name: 'protocoloId', type: Number, required: false, description: 'Filtro por protocolo' })
  @ApiQuery({ name: 'esTestigo', type: Boolean, required: false, description: 'Filtro por si es testigo' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sort') sort = 'numeroTrat',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
    @Query('q') q?: string,
    @Query('protocoloId') protocoloId?: number,
    @Query('esTestigo') esTestigo?: boolean,
  ) {
    return this.service.findAll({
      page,
      limit,
      sort,
      order,
      q,
      protocoloId,
      esTestigo,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tratamiento por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del tratamiento' })
  @ApiOkResponse({ type: Tratamiento, description: 'Tratamiento encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tratamiento' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Tratamiento, description: 'Tratamiento actualizado' })
  @ApiBody({
    type: UpdateTratamientoDto,
    examples: {
      default: {
        value: {
          descripcion: 'Fomesafen 25% + GZ - 800+500 cc/ha - V4 (Actualizado)',
          numeroTrat: 3,
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTratamientoDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tratamiento' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
