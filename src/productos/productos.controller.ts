import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from '../entities/producto.entity';
import { PageQueryDto } from '../common/dto/pagination.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('productos')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('productos')
export class ProductosController {
  constructor(private readonly service: ProductosService) {}

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  @ApiCreatedResponse({
    type: Producto,
    description: 'Producto creado',
    schema: { example: {
      id: 1,
      nombre_comercial: 'Herbicida X',
      descripcion: 'Herbicida selectivo para maíz',
      principio_activo: 'Glifosato 48%',
      formulacion: 'SL',
      tipo: 'Herbicida',
      unidad: 'L/ha',
      precio: 150.50,
      laboratorio: { id: 1, nombre: 'Lab Principal' }
    } }
  })
  @ApiBody({
    type: CreateProductoDto,
    examples: {
      default: {
        summary: 'Producto completo',
        value: {
          nombre_comercial: 'Herbicida X',
          descripcion: 'Herbicida selectivo para maíz post-emergencia',
          principio_activo: 'Glifosato 48%',
          formulacion: 'SL',
          tipo: 'Herbicida',
          unidad: 'L/ha',
          precio: 150.50,
          laboratorioId: 1,
        },
      },
      minimal: {
        summary: 'Solo nombre requerido',
        value: {
          nombre_comercial: 'Mi Producto',
        },
      },
    },
  })
  create(@Body() dto: CreateProductoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos (paginado y filtrado)' })
  @ApiOkResponse({
    description: 'Lista paginada de productos',
    schema: {
      example: {
        data: [
          { id: 1, nombre_comercial: 'Herbicida X', tipo: 'Herbicida', precio: 150.50 }
        ],
        meta: { total: 1, page: 1, limit: 10, pageCount: 1 }
      }
    }
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Registros por página' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: 'Campo para ordenar' })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC','DESC'], description: 'Dirección de orden' })
  @ApiQuery({ name: 'laboratorioId', required: false, type: Number, description: 'Filtrar por laboratorio' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Buscar por nombre/tipo/principio activo' })
  findAll(@Query() query: PageQueryDto & { laboratorioId?: number; q?: string }) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Producto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Producto })
  @ApiBody({
    type: UpdateProductoDto,
    examples: {
      cambioNombre: {
        summary: 'Cambiar nombre y laboratorio',
        value: {
          nombre_comercial: 'Herbicida X Plus',
          laboratorioId: 2,
        },
      },
    },
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
