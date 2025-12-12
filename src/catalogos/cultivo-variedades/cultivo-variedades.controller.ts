import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CultivoVariedadesService } from './cultivo-variedades.service';
import { CreateCultivoVariedadDto } from './dto/create-cultivo-variedad.dto';
import { UpdateCultivoVariedadDto } from './dto/update-cultivo-variedad.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../entities/rol.entity';

@ApiTags('Catálogo - Variedades de Cultivo')
@ApiBearerAuth()
@Controller('catalogos/cultivo-variedades')
export class CultivoVariedadesController {
  constructor(private readonly cultivoVariedadesService: CultivoVariedadesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Crear una nueva variedad (asignada a un cultivo)' })
  @ApiResponse({ status: 201, description: 'Variedad creada' })
  @ApiResponse({ status: 404, description: 'Cultivo padre no encontrado' })
  create(@Body() createCultivoVariedadDto: CreateCultivoVariedadDto) {
    return this.cultivoVariedadesService.create(createCultivoVariedadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de todas las variedades' })
  findAll() {
    return this.cultivoVariedadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una variedad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cultivoVariedadesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Actualizar una variedad' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCultivoVariedadDto: UpdateCultivoVariedadDto) {
    return this.cultivoVariedadesService.update(id, updateCultivoVariedadDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Eliminar una variedad' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cultivoVariedadesService.remove(id);
  }
}
