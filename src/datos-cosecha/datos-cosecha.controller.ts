import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DatosCosechaService } from './datos-cosecha.service';
import { CreateDatosCosechaDto } from './dto/create-datos-cosecha.dto';
import { UpdateDatosCosechaDto } from './dto/update-datos-cosecha.dto';
import { DatosCosecha } from '../entities/datos-cosecha.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('datos-cosecha')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('datos-cosecha')
export class DatosCosechaController {
  constructor(private readonly service: DatosCosechaService) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear registro de datos de cosecha' })
  @ApiCreatedResponse({ type: DatosCosecha, description: 'Datos de cosecha creados' })
  @ApiBody({
    type: CreateDatosCosechaDto,
    examples: {
      default: {
        value: {
          parcelaId: 1,
          fechaCosecha: '2025-05-30',
          humedadPct: 14.2,
          kgHaCorregido: 5200.5,
          gie: 123.45,
          observaciones: 'Trilla sin inconvenientes',
        },
      },
    },
  })
  create(@Body() dto: CreateDatosCosechaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar datos de cosecha (opcionalmente filtrar por parcelaId)' })
  @ApiQuery({ name: 'parcelaId', type: Number, required: false })
  @ApiOkResponse({ type: DatosCosecha, isArray: true })
  findAll(@Query('parcelaId') parcelaId?: string) {
    if (parcelaId) {
      return this.service.findByParcelaId(parseInt(parcelaId, 10));
    }
    return this.service.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Obtener datos de cosecha por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DatosCosecha })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de cosecha' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DatosCosecha })
  @ApiBody({
    type: UpdateDatosCosechaDto,
    examples: {
      default: {
        value: {
          humedadPct: 13.8,
          observaciones: 'Secado adicional realizado',
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDatosCosechaDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar datos de cosecha' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
