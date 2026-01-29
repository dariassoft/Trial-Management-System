import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { ParcelasService } from './parcelas.service';
import { CreateParcelaDto } from './dto/create-parcela.dto';
import { UpdateParcelaDto } from './dto/update-parcela.dto';
import { Parcela } from '../entities/parcela.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('parcelas')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('parcelas')
export class ParcelasController {
  constructor(private readonly service: ParcelasService) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear una parcela' })
  @ApiCreatedResponse({ type: Parcela, description: 'Parcela creada' })
  @ApiBody({
    type: CreateParcelaDto,
    examples: {
      default: {
        value: {
          ensayoId: 1,
          bloqueId: 1,
          tratamientoId: 1,
          nombreParcela: '26-BASF-0001-PRE-1 A',
          posXGrid: 2,
          posYGrid: 3,
        },
      },
    },
  })
  create(@Body() dto: CreateParcelaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar parcelas con filtros opcionales' })
  @ApiOkResponse({ type: Parcela, isArray: true })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('ensayoId', new ParseIntPipe({ optional: true })) ensayoId?: number,
    @Query('bloqueId', new ParseIntPipe({ optional: true })) bloqueId?: number,
  ) {
    const params = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sort: sort || 'id',
      order: order || 'ASC',
      ensayoId,
      bloqueId,
    };
    return this.service.findAll(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener parcela por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Parcela })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcela' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Parcela })
  @ApiBody({
    type: UpdateParcelaDto,
    examples: {
      default: {
        value: {
          posXGrid: 5,
          posYGrid: 6,
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateParcelaDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar parcela' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
