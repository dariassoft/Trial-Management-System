import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { DatosSiembraService } from './datos-siembra.service';
import { CreateDatosSiembraDto } from './dto/create-datos-siembra.dto';
import { UpdateDatosSiembraDto } from './dto/update-datos-siembra.dto';
import { DatosSiembra } from '../entities/datos-siembra.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiBearerAuth()
@ApiTags('datos-siembra')
@Controller('datos-siembra')
export class DatosSiembraController {
  constructor(private readonly service: DatosSiembraService) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear registro de datos de siembra' })
  @ApiOkResponse({ type: DatosSiembra })
  create(@Body() dto: CreateDatosSiembraDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar datos de siembra (opcionalmente filtrar por parcelaId o ensayoId)' })
  @ApiQuery({ name: 'parcelaId', type: Number, required: false })
  @ApiQuery({ name: 'ensayoId', type: Number, required: false })
  @ApiOkResponse({ type: DatosSiembra, isArray: true })
  findAll(@Query('parcelaId') parcelaId?: string, @Query('ensayoId') ensayoId?: string) {
    if (parcelaId) {
      return this.service.findByParcelaId(parseInt(parcelaId, 10));
    }
    if (ensayoId) {
      return this.service.findByEnsayoId(parseInt(ensayoId, 10));
    }
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener datos de siembra por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DatosSiembra })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de siembra' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: DatosSiembra })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDatosSiembraDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar datos de siembra' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

