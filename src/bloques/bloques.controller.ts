import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiParam } from '@nestjs/swagger';
import { BloquesService } from './bloques.service';
import { CreateBloqueDto } from './dto/create-bloque.dto';
import { UpdateBloqueDto } from './dto/update-bloque.dto';
import { Bloque } from '../entities/bloque.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../entities/rol.entity';

@ApiTags('bloques')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'No autenticado' })
@ApiForbiddenResponse({ description: 'Prohibido' })
@Controller('bloques')
export class BloquesController {
  constructor(private readonly service: BloquesService) {}

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear un bloque' })
  @ApiCreatedResponse({ type: Bloque, description: 'Bloque creado' })
  @ApiBody({ type: CreateBloqueDto })
  create(@Body() dto: CreateBloqueDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar bloques' })
  @ApiOkResponse({ type: Bloque, isArray: true })
  findAll(@Query('ensayoId') ensayoId?: string) {
    const ensayoIdNum = ensayoId ? parseInt(ensayoId, 10) : undefined;
    return this.service.findAll(ensayoIdNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener bloque por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Bloque })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar bloque' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: Bloque })
  @ApiBody({ type: UpdateBloqueDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBloqueDto) {
    return this.service.update(id, dto);
  }

  @Roles(Role.TECNICO, Role.MANAGER, Role.ADMIN, Role.SUPERADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar bloque' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
