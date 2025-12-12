import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { TratamientosProductoService } from './tratamientos-producto.service';
import { CreateTratamientoProductoDto } from './dto/create-tratamiento-producto.dto';
import { UpdateTratamientoProductoDto } from './dto/update-tratamiento-producto.dto';
import { TratamientoProducto } from '../entities/tratamiento-producto.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('tratamientos-producto')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('tratamientos-producto')
export class TratamientosProductoController {
  constructor(private readonly service: TratamientosProductoService) {}

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Asociar un producto a un tratamiento (con dosis y estadio)' })
  @ApiCreatedResponse({ type: TratamientoProducto, description: 'Asociación creada' })
  @ApiBody({
    type: CreateTratamientoProductoDto,
    examples: {
      default: {
        value: {
          tratamientoId: 1,
          productoId: 2,
          dosis: '800',
          unidadDosis: 'cc/ha',
          estadio: 'V4',
        },
      },
      testigo: {
        value: {
          tratamientoId: 1,
          productoId: null,
          dosis: null,
          unidadDosis: null,
          estadio: null,
        },
      },
    },
  })
  create(@Body() dto: CreateTratamientoProductoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar asociaciones Tratamiento-Producto' })
  @ApiOkResponse({ type: TratamientoProducto, isArray: true })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener asociación por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: TratamientoProducto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar asociación Tratamiento-Producto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: TratamientoProducto })
  @ApiBody({
    type: UpdateTratamientoProductoDto,
    examples: {
      default: {
        value: {
          dosis: '500',
          unidadDosis: 'gr/ha',
          estadio: 'V3',
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTratamientoProductoDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar asociación' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
