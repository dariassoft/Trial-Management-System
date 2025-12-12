import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { AplicacionesService } from './aplicaciones.service';
import { CreateAplicacionDto } from './dto/create-aplicacion.dto';
import { UpdateAplicacionDto } from './dto/update-aplicacion.dto';
import { Aplicacion } from '../entities/aplicacion.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('aplicaciones')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('aplicaciones')
export class AplicacionesController {
  constructor(private readonly service: AplicacionesService) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear una aplicación' })
  @ApiCreatedResponse({ type: Aplicacion, description: 'Aplicación creada' })
  @ApiBody({
    type: CreateAplicacionDto,
    examples: {
      default: {
        value: {
          ensayoId: 1,
          nombreAplicacion: 'Primera aplicación',
          fechaHora: '2025-03-18T10:30:00.000Z',
          estadioCultivo: 'V6',
          tempC: 25.5,
          humedadPct: 60.0,
          vientoKmh: 12.3,
          equipoInfo: 'Pulverizadora Jacto',
          picoInfo: 'XR11002',
          presionBar: 2.5,
        },
      },
    },
  })
  create(@Body() dto: CreateAplicacionDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aplicaciones' })
  @ApiOkResponse({ type: Aplicacion, isArray: true })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener aplicación por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Aplicacion })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar aplicación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Aplicacion })
  @ApiBody({
    type: UpdateAplicacionDto,
    examples: {
      default: {
        value: {
          estadioCultivo: 'V8',
          tempC: 22.1,
          presionBar: 2.8,
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAplicacionDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar aplicación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
